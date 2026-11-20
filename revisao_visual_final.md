# Revisão visual final

Crítico visual independente (subagente com acesso apenas às capturas de tela, sem código-fonte nem relatórios), executado sobre as 10 imagens em `trabalho/capturas/`.

**Veredito: SEM DEFEITOS GRAVES OU MÉDIOS.**

## Correções aplicadas entre a primeira e a última revisão

| Item | Antes | Depois |
|---|---|---|
| Divisor na chave de divisão | flutuava ~1,2 mm acima da linha | apoiado na linha horizontal |
| Quociente no gabarito | muito afastado da linha | alinhado logo acima da linha |
| Traços em contas de 3 parcelas | desalinhados entre si | alinhados por `minTermos` |
| Coluna das unidades | variava entre contas da mesma linha | fixa por `maxL`/`maxDvd` |
| Resultado do gabarito (adição/subtração) | muito abaixo do traço | alinhado ao topo da área de resposta |
| Multiplicação N5 na folha do aluno | produtos parciais já impressos | linhas em branco, com 26 mm reservados |
| Rodapé do painel | cortava o conteúdo | fixo no fim do painel rolável |
| Pré-visualização | cortada na largura e sem rolagem com a roda do mouse | "Ajustar à tela" por largura e altura; painel e prévia rolam com a roda |
| Cabeçalho | nomes de escola e turma pré-preenchidos | campos vazios, com dicas de preenchimento |

## Pontos conferidos e aprovados

- Alinhamento de unidade/dezena/centena dentro de cada conta e entre contas da mesma linha; rótulos UM C D U coincidentes com as colunas (conferência em ~1 px).
- Sinais `+`, `−`, `×` à esquerda do último termo, fora da coluna dos algarismos.
- Traços contínuos e nítidos; chave de divisão em "L" íntegra, divisor sobre a linha, quociente e `Q = … / R = …` corretos no gabarito.
- Espaço amplo para cálculo manual: "vai um" acima do primeiro termo, resultado abaixo do traço, 26 mm para os dois produtos parciais da multiplicação de 2 algarismos, subtrações parciais abaixo do dividendo.
- Folhas do aluno sem respostas; gabaritos com resultados, selo "GABARITO" e produtos parciais deslocados corretamente uma casa.
- Numeração clara, nenhuma conta cortada ou espremida, nenhum elemento de interface vazando para o PDF, nenhuma quebra no meio de uma conta.
- Interface organizada e pré-visualização fiel à folha impressa.

## Único achado restante (menor)

Na captura da interface com a janela em 1440×900, a última linha da caixa de exemplos fica parcialmente encoberta pelo rodapé fixo do botão "Gerar PDF / Imprimir". O painel é rolável e há espaço extra ao final, então basta rolar para visualizar; não afeta em nada as páginas impressas.

## Arquivos

- Capturas e PDFs de verificação: `trabalho/capturas/`
- Testes: `trabalho/testes.mjs`, `trabalho/audit.mjs`, `trabalho/capturas.mjs`
- Auditoria: `auditoria_4000.md`
- Exemplo: `atividade_exemplo.pdf`
