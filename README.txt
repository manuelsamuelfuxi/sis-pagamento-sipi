gerador de rupe: https://rupe-api.onrender.com/swagger-ui/index.html#/portal-controller/gerar

rodar o express npm run dev -- --host


# SPS — Sistema de Pagamento Simulado

Simulador de um ATM desktop para pagamento de RUPEs (Referência Única de Pagamento ao Estado), desenvolvido pelo Grupo 9.

É uma aplicação **só frontend**, em React (Vite). Não tem back-end nem base de dados: tudo funciona com ficheiros *mock*. A arquitectura está preparada
para, mais tarde, trocar os mocks por uma API real sem mexer nas páginas.

## Como correr

```bash
npm install
npm run dev
```

Variáveis de ambiente (opcionais, ficheiro `.env`):

| Variável | Valor por omissão | Efeito |
|----------|-------------------|--------|
| `VITE_USAR_MOCK` | `true`    | Com `false`, a fábrica usa os serviços `Api` em vez dos `Mock` |
| `VITE_API_URL` | `http://localhost:8080/api` | URL base passada aos serviços `Api` |

## Arquitectura de ficheiros

```
src/
├── dados/
│   └── mock/
│       ├── credenciaisMock.js        utilizadores/PIN (único mock permanente)
│       ├── slidesMock.js             slides do carrossel do login
│       └── rupesMock.js              RUPEs provisórios (até haver API)
├── servicos/
│   ├── ServicoAutenticacao.js        contrato da autenticação
│   ├── ServicoAutenticacaoMock.js
│   ├── ServicoAutenticacaoApi.js
│   ├── ServicoRupes.js               contrato dos RUPEs + constantes e ErroRupe
│   ├── ServicoRupesMock.js
│   ├── ServicoRupesApi.js
│   └── fabricaServicos.js            escolhe Mock ou Api
├── contexto/
│   └── ContextoServicos.jsx          disponibiliza os serviços via useServicos()
├── hooks/
│   └── useLogin.js                   lógica do PIN (tentativas, bloqueio)
├── utilitarios/
│   └── formatadores.js               formatarRupe, formatarValor, formatarDataHora
├── componentes/
│   ├── IndicadorPin.jsx
│   ├── TecladoNumerico.jsx
│   └── CarrosselImagens.jsx
├── paginas/
│   ├── Login/                PaginaLogin.jsx + .css
│   ├── Menu/                 PaginaMenu.jsx + .css
│   ├── Pagamentos/           PaginaPagamentos.jsx + .css   (entrada do RUPE)
│   ├── Validacao/            PaginaValidacao.jsx + .css    (RUPE + valor, Confirmar)
│   ├── Comprovativo/         PaginaComprovativo.jsx + .css
│   ├── Consulta/             PaginaConsulta.jsx            (reutiliza PaginaPagamentos)
│   └── ResultadoConsulta/    PaginaResultadoConsulta.jsx + .css
├── App.jsx                   controla qual ecrã está activo
└── main.jsx
```

## Como funciona a navegação

Não há router. O `App.jsx` guarda um estado `ecra` e mostra a página correspondente. Os dados que passam de um ecrã para outro (o RUPE encontrado,
o comprovativo) também vivem no `App.jsx`.

| Valor de `ecra` | Página |
|---|---|
| `login` | PaginaLogin |
| `menu` | PaginaMenu |
| `pagamentos` | PaginaPagamentos |
| `validacao` | PaginaValidacao |
| `comprovativo` | PaginaComprovativo |
| `consulta` | PaginaConsulta |
| `resultadoConsulta` | PaginaResultadoConsulta |

## Fluxo completo

```mermaid
flowchart TD
    L[login] -->|PIN correcto| M[menu]
    M -->|1| P[pagamentos]
    M -->|2| C[consulta]
    M -->|tempo esgotado| L
    P -->|RUPE aberto| V[validacao]
    P -->|nao existe, pago ou expirado| P
    P -->|Cancelar| M
    V -->|Confirmar| K[comprovativo]
    V -->|Cancelar| M
    K -->|apos 10 s| L
    C -->|RUPE existe| R[resultadoConsulta]
    C -->|nao existe| C
    C -->|Cancelar| M
    R -->|Nova consulta| C
    R -->|Menu| M
```

1. **Login.** O utilizador introduz o PIN no teclado do ecrã ou no teclado físico. O `useLogin` valida através do serviço de autenticação. Ao autenticar,
o `App` passa para o menu.
2. **Menu.** Duas opções: `1` Pagamentos e `2` Consultar (clique ou tecla). Há um temporizador de 5 segundos (`TEMPO_LIMITE_MS`): se o utilizador não
escolher, volta ao login.
3. **Pagamentos.** O utilizador introduz o RUPE (20 dígitos, em quadrados agrupados 3-3-3-3-3-3-2) e carrega em OK. O serviço procura o RUPE:
   - não existe: mostra o erro, limpa os quadrados e fica na página;
   - existe mas está pago ou expirado: mostra o erro e fica na página;
   - existe e está aberto: segue para a validação.
4. **Validação.** Mostra o RUPE e o valor. Em Confirmar, o serviço executa o pagamento (o RUPE passa a `pago`) e devolve um comprovativo. Enquanto o
pagamento está a ser processado, Confirmar e Cancelar ficam desactivados.
5. **Comprovativo.** Mostra o nº da transacção, o RUPE, o valor e a data/hora. Passados 10 segundos (`TEMPO_COMPROVATIVO_MS`), o `App` limpa os dados
da memória e volta ao login.
6. **Consulta.** É a mesma página da de pagamentos, com a prop `aceitarQualquerEstado`, porque aqui um RUPE pago ou expirado é um resultado válido.
Só um RUPE inexistente dá erro.
7. **Resultado da consulta.** Mostra o RUPE, o estado (selo a cores: aberto, pago, expirado) e o valor. Botões: Nova consulta ou Menu.

## Atalhos de teclado

| Ecrã | Teclas |
|---|---|
| Login | dígitos, Backspace |
| Menu | `1` Pagamentos, `2` Consultar |
| Pagamentos / Consulta | dígitos, Backspace, Ctrl+V (colar RUPE), Enter (OK), Esc (Cancelar) |
| Validação | Enter (Confirmar), Esc (Cancelar) |
| Resultado da consulta | Enter (Nova consulta), Esc (Menu) |

## Serviços e mocks

Cada serviço segue o padrão **contrato, Mock, Api**. As páginas só conhecem o contrato, através de `useServicos()`; a `fabricaServicos` decide qual
implementação usar.

**ServicoRupes**

| Método | Devolve | Erros (`ErroRupe.codigo`) |
|---|---|---|
| `consultar(rupe)` | `{ rupe, estado, valor }` | `FORMATO_INVALIDO`, `NAO_ENCONTRADO` |
| `pagar(rupe)` | `{ numeroTransacao, rupe, valor, dataHora }` | `NAO_ENCONTRADO`, `JA_PAGO`, `EXPIRADO` |

Estados possíveis de um RUPE (`ESTADOS_RUPE`): `aberto`, `pago`, `expirado`.

**Dados de teste** (`dados/mock/rupesMock.js`):

| RUPE | Estado | Valor (Kz) |
|---|---|---|
| 20260100000000000001 | aberto | 15 000 |
| 20260100000000000002 | aberto | 2 500 |
| 20260100000000000003 | aberto | 48 000 |
| 20250900000000000004 | pago | 7 500 |
| 20250900000000000005 | pago | 20 000 |
| 20240100000000000006 | expirado | 3 000 |
| 20240100000000000007 | expirado | 10 000 |

Qualquer outro número de 20 dígitos (por exemplo `12345678901234567890`) dá "RUPE não encontrado". Os utilizadores e PINs estão em
`dados/mock/credenciaisMock.js`.

## Decisões de desenho

- **O RUPE é sempre uma `string`.** 20 dígitos excedem a precisão segura dos números do JavaScript.
- **O valor guarda-se como número** e só é formatado ao mostrar (`Intl.NumberFormat`, `pt-AO`, `AOA`).
- **O estado do mock vive em memória.** Pagar um RUPE muda-o para `pago` enquanto a página não for recarregada; com F5 o mock volta ao início.
- **Os dados não ficam entre clientes.** Ao terminar a sessão ou sair para o menu, o `App` limpa o RUPE e o comprovativo.
- **Não se cancela um pagamento em curso.** Depois de submetido, os botões ficam desactivados.
- **O serviço revalida no `pagar`.** Não confia na consulta anterior, porque o estado pode ter mudado.

## Passar de mock para API

1. Implementar `consultar` e `pagar` em `ServicoRupesApi.js` (e o login em `ServicoAutenticacaoApi.js`), lançando `ErroRupe` com os códigos acima
para que as páginas não mudem.
2. Definir `VITE_USAR_MOCK=false` e `VITE_API_URL` no `.env`.
3. `rupesMock.js` deixa de ser usado; o `credenciaisMock.js` mantém-se enquanto não houver autenticação real.

## Próximos passos possíveis

- Imprimir o comprovativo (`window.print()`).
- Temporizador de inactividade nas páginas de RUPE, reutilizável (`useInactividade`).
- Histórico de pagamentos na opção Consultar.