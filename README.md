# Exercício de Code Review — React + TypeScript

Bem-vindo/a. Este é um exercício curto de **code review**.

## Contexto

Em [`src/TodoDashboard.tsx`](src/TodoDashboard.tsx) tens um componente `TodoDashboard`
que mostra a lista de tarefas de um utilizador, com filtros (todas / ativas / concluídas),
contagem de concluídas e destaque para tarefas urgentes.

O componente **funciona** (umas coisas melhor que outras), mas está longe de estar
production-ready. Imagina que te chegou como um Pull Request de um colega.

## O teu objetivo

Faz-lhe um code review como farias a esse PR. Procura:

- **Bugs de comportamento** — casos em que o componente faz algo errado ou inesperado.
- **Anti-patterns de React** — uso de hooks, estado, efeitos, keys, etc.
- **Código a otimizar / simplificar** — trabalho desnecessário, estado redundante, legibilidade.

Para **cada ponto** que encontrares, explica:

1. **O QUE** está mal (e, se aplicável, em que situação se manifesta).
2. **COMO** o mudarias (descreve a correção; podes escrever o código se preferires).

Não precisas de encontrar "a resposta certa" única — interessa-nos o teu raciocínio,
a forma como priorizas os problemas e como comunicas o feedback.


