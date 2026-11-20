# 4 operações básicas

Gerador offline de folhas de atividades de Matemática em A4, com as quatro operações básicas, cinco níveis pedagógicos, contas armadas, pré-visualização em tempo real e exportação de PDF nativa (`window.print()`).

## Uso

1. Baixe ou abra `index.html` diretamente no navegador (Chrome, Edge ou Safari). Não precisa de servidor nem de internet.
2. Configure cabeçalho, operação, nível, quantidade de questões, colunas, rótulos de ordem e gabarito.
3. Clique em **Gerar PDF / Imprimir**. No diálogo, escolha **A4**, escala **100%**, margens **nenhuma** e desmarque cabeçalhos/rodapés.

## Arquivos

- `index.html` — gerador completo (HTML + CSS + JS em um único arquivo).
- `PROMPT.md` — prompt original mais todos os ajustes posteriores, consolidados.
- `auditoria_4000.md` — auditoria pedagógica das 4.000 questões.
- `atividade_exemplo.pdf` — exemplo de folha gerada.
- `revisao_visual_final.md` — revisão do crítico visual.
- Scripts e capturas de verificação: `audit.mjs`, `testes.mjs`, `capturas.mjs`, `entregar.mjs` e as imagens PNG.

## Verificação

- 4.000/4.000 questões válidas, sem duplicatas em folhas de 20.
- PDFs com 1 página sem gabarito e 2 páginas com gabarito.
- Crítico visual independente: sem defeitos graves ou médios.
