# Prompt consolidado — gerador de folhas de Matemática A4

Este arquivo reúne o prompt original (que gerou o `index.html`) **mais todos os pedidos de ajuste feitos depois**, já incorporados ao código entregue. Serve para regenerar o arquivo exatamente como está hoje.

---

## 1. Prompt original (integral)

Construa um gerador de folhas de atividades de Matemática sobre as quatro operações básicas (adição, subtração, multiplicação e divisão), entregue em um único arquivo `index.html` autocontido, que roda localmente no navegador, permite configurar a operação, o nível de dificuldade segundo a progressão pedagógica e o cabeçalho da folha, visualiza a folha em tempo real e exporta/gera PDF pronto para impressão em A4 com **todas as contas já armadas** e espaço adequado para resolução manual do aluno (com opção de gabarito resolvido).

### PRIORIDADES (nesta ordem, quando entrarem em conflito)
1. Rigor pedagógico na geração das contas (cada nível deve respeitar estritamente as regras cognitivas e algorítmicas definidas, sem "vazar" contas de outro nível).
2. Qualidade tipográfica e alinhamento perfeito das contas armadas no layout A4 (unidade sob unidade, dezena sob dezena, centena sob centena, chave de divisão limpa, traços nítidos e área em branco suficiente para o cálculo manual do aluno).
3. Usabilidade e rapidez na geração e exportação em PDF.
4. Tamanho e simplicidade da entrega.

### RESTRIÇÕES
- Sem frameworks pesados nem bibliotecas externas em runtime: nada de React, Vue, Tailwind via CDN, jsPDF ou html2pdf carregados pela rede. Todo o HTML, CSS e JavaScript devem estar dentro de um único `index.html` que funciona 100% offline.
- A geração do PDF deve usar CSS `@media print` / `@page` nativo de alta precisão (com acionamento direto via `window.print()`), garantindo texto e linhas vetoriais nítidas na impressão (nada de rasterizar a folha em imagem borrada).
- Tudo procedural: todas as contas, cabeçalho escolar e gabarito resolvido são gerados no código a partir de uma semente (seed) reproduzível e editável, evitando contas repetidas na mesma folha.
- A entrega final deve ser um único `index.html` autocontido. Informe o tamanho final.

### ALVO
- Navegador desktop moderno (Chrome/Edge/Safari) em tela 1440×900 ou superior.
- Impressão / Exportação PDF em folha A4 retrato (210 mm × 297 mm), margens equilibradas, cabendo exatamente 1 folha de atividades (e opcionalmente 1 folha de gabarito na página seguinte) sem quebra indesejada no meio de uma conta armada.

### LAYOUT OBRIGATÓRIO DAS CONTAS ARMADAS
Todas as questões devem ser exibidas como **conta armada**, em grade de 2, 3 ou 4 colunas com numeração clara (`1)`, `2)`, ...), usando grade de células de largura fixa para alinhamento posicional absoluto.

1. **Adição e Subtração (armadas verticalmente):** parcelas alinhadas à direita (unidade sob unidade etc.); espaço livre acima do primeiro termo (mín. 6 mm) para "vai um"/empréstimos; sinal (`+` ou `−`) à esquerda da última parcela, fora da coluna dos algarismos; traço horizontal contínuo e nítido; espaço em branco abaixo do traço (mín. 10 mm) para o resultado.
2. **Multiplicação (armada verticalmente):** multiplicando acima, multiplicador abaixo alinhado à direita, sinal `×` à esquerda do multiplicador e traço. Multiplicador de 1 algarismo: mín. 12 mm para o resultado. Multiplicador de 2 algarismos: mín. 26 mm para duas linhas de produtos parciais, sinal `+`, segundo traço e resultado.
3. **Divisão (chave tradicional brasileira):** formato `Dividendo | Divisor`, linha vertical e linha horizontal sob o divisor formando o "L"; espaço em branco à direita (mín. 22 mm) e abaixo do dividendo (mín. 28 mm) para subtrações parciais, descida de algarismos e quociente.
4. **Folha de Gabarito (opcional):** segunda página A4 idêntica na estrutura, com resultados finais e, na divisão, quociente e resto `Q = ... / R = ...`.

### PROGRESSÃO PEDAGÓGICA (REGRAS OBRIGATÓRIAS)
Operação específica ou modo "Misto", com nível de 1 a 5 por operação:

**Adição**
- N1: soma até 10 ou 20, parcelas de 1 algarismo (`4 + 3`, `7 + 8`).
- N2: 2 ou 3 algarismos, soma em cada ordem sempre ≤ 9 (`42 + 35`, `123 + 254`).
- N3: reagrupamento em apenas uma ordem — só unidade ou só dezena (`38 + 25`, `146 + 137`).
- N4: reagrupamento em duas ou mais ordens consecutivas, incluindo zeros (`287 + 346`, `409 + 295`).
- N5: parcelas de 4 algarismos ou três parcelas simultâneas com múltiplos reagrupamentos (`1.486 + 2.759`).

**Subtração**
- N1: minuendo até 10 ou 20, subtraendo de 1 algarismo, resultado ≥ 0 (`9 - 4`, `15 - 7`).
- N2: 2 ou 3 algarismos sem recurso, cada algarismo do minuendo ≥ o do subtraendo (`487 - 235`).
- N3: exatamente um empréstimo entre ordens adjacentes (`54 - 38`, `362 - 147`).
- N4: empréstimos em mais de uma ordem, sem zeros intercalados (`523 - 268`).
- N5: zeros no minuendo que obrigam empréstimo em cadeia (`300 - 147`, `502 - 268`, `1.004 - 459`).

**Multiplicação**
- N1: tabuadas de 2 a 5 e 10 (`4 × 7`).
- N2: tabuadas de 6 a 9 (`7 × 8`).
- N3: 2 ou 3 algarismos × 1 algarismo, sem reserva (`23 × 3`).
- N4: 2 ou 3 algarismos × 1 algarismo, com reserva e zeros internos (`208 × 4`).
- N5: 2 ou 3 algarismos × 2 algarismos, com duas linhas de produtos parciais e soma final (`34 × 26`).

**Divisão**
- N1: dividendo até 50, divisor de 1 algarismo, exata (`24 ÷ 4`).
- N2: 2 algarismos ÷ 1 algarismo, exata, cada algarismo múltiplo direto do divisor (`84 ÷ 4`).
- N3: 2 ou 3 algarismos ÷ 1 algarismo, exata, com reagrupamento (`144 ÷ 6`).
- N4: não exata, com resto ≠ 0 (`139 ÷ 5`).
- N5: zero intercalado no quociente ou divisor de 2 algarismos (`618 ÷ 3`, `480 ÷ 12`).

### INTERFACE E OPÇÕES
- Painel lateral de controle (que desaparece na impressão/PDF) e pré-visualização fiel da folha A4.
- Cabeçalho personalizável: Escola/Instituição, Professor(a), Turma, Data e linha para Nome do Aluno.
- Seleção de Operação (Adição, Subtração, Multiplicação, Divisão ou Mista com seleção múltipla).
- Nível Pedagógico (1 a 5) com explicação curta e exemplo vivo do critério.
- Quantidade de questões (8, 12, 16 ou 20) e colunas (2, 3 ou 4), ajustando o espaçamento vertical para caber em 1 A4.
- Opções: incluir/ocultar gabarito, mostrar/ocultar rótulos discretos de ordem (`C D U`), gerar nova lista com exibição e edição da semente.
- Botão principal: **Gerar PDF / Imprimir**.

### VERIFICAÇÃO
- Auditoria automatizada: 200 questões por Operação × Nível (4.000), validação matemática de 100% contra as regras e ausência de duplicatas na mesma folha.
- Crítico visual: subagente novo a cada rodada, que vê apenas capturas da interface e páginas do PDF em PNG, sem ler código; avalia alinhamento, sinais, chave de divisão, espaço para cálculo manual, vazamento de UI e quebras de página. Severidade: grave / médio / menor. Iterar até não haver defeitos acima de "menor".
- Teste funcional via Playwright: abrir `index.html` sem servidor/rede, cobrir todas as operações e níveis, gerar PDF via impressão headless e verificar páginas (1 sem gabarito, 2 com gabarito).

### PRONTO QUANDO
Passarem as três verificações sem defeitos graves ou médios. Entregar `index.html` final, tamanho do arquivo, relatório da auditoria das 4.000 questões, exemplo de `atividade_exemplo.pdf` e revisão final do crítico visual.

### AMBIENTE
Chrome e Playwright locais; `pdftoppm` para converter PDF em imagens. Scripts, capturas e temporários em `trabalho/`; raiz limpa apenas com os entregáveis finais.

---

## 2. Decisões de implementação acordadas depois

- Layout por **grade CSS de células de algarismo de largura fixa** (`--cw`) com `grid-row`/`grid-column` explícitos, garantindo alinhamento posicional.
- Largura da célula por número de colunas: `CW_POR_COL = { 2: 8, 3: 6.5, 4: 5.4 }` mm; altura da linha do termo escala com `cw`.
- Grade uniforme por folha: todas as contas preenchidas até `maxL` colunas e `minTermos` linhas, para unidades e traços alinhados dentro de cada linha.
- Laço de ajuste automático: aumenta colunas (até 4) quando as linhas estouram e depois reduz a quantidade de questões, com aviso visível.
- Multiplicação N2 gera apenas 16 contas distintas → folha limitada a 16 com aviso.
- API de testes `window.MG` expõe `RNG, gerarQuestao, validar, gerarFolha, chaveDe, analisar*, alturaConta, htmlConta, montarPagina, listaAlvos, estado, render, gerarAmostra` — a auditoria roda sobre o código de produção.
- Nomenclatura: usar **"semente"**, não "seed", no texto visível da interface.

## 3. Ajustes pedidos posteriormente (já aplicados)

1. **Correções do primeiro crítico visual (D1–D8):**
   - divisor apoiado na linha da chave (não flutuando acima);
   - quociente rente à linha no gabarito;
   - traços alinhados em contas de 3 parcelas (via `minTermos`);
   - coluna das unidades fixa por `maxL`/`maxDvd`;
   - resultado do gabarito alinhado ao topo da área de resposta;
   - rodapé do painel fixo e rolável;
   - troca de "seed" por "semente";
   - controles de zoom na pré-visualização (`Ajustar à tela` / `100%`), com `zoom:1!important` na impressão.
2. **Roda do mouse:** o painel e a pré-visualização não rolavam porque os itens do grid/flex tinham `min-height:auto` e cresciam além da janela, sendo cortados. Corrigido com `min-height:0` em `.painel`, `.palco` e `.rolagem`. O botão "Ajustar à tela" agora considera largura **e** altura da área disponível.
3. **Multiplicação N5 — folha do aluno:** **remover os produtos parciais**. Eles devem ficar em branco, com o espaço de 26 mm reservado entre os dois traços para o aluno calcular. Os produtos parciais preenchidos devem aparecer **somente no gabarito** (junto com o resultado final em negrito).
4. **Cabeçalho:** **remover os nomes padrão** `Escola Municipal Monteiro Lobato` e `4º ano A` dos campos. Os campos de Escola, Professor(a) e Turma devem começar vazios (com `placeholder` apenas como dica, que não aparece na impressão). A Data pode manter a máscara `____ / ____ / ______`.
5. **Entrega no GitHub:** incluir no repositório este `PROMPT.md`, o `index.html`, os relatórios e o PDF de exemplo; abrir a aba de login do GitHub para o usuário.

## 4. Estado final esperado

- Arquivo único, offline, sem dependências; ~45 KB.
- 4.000/4.000 questões válidas; nenhuma duplicata em folha de 20.
- PDFs: 1 página sem gabarito, 2 com gabarito; nenhuma conta cortada e nenhum elemento de UI impresso.
- Crítico visual final: **SEM DEFEITOS GRAVES OU MÉDIOS**.
- Pré-visualização e painel roláveis com a roda do mouse; folha inteira cabe na janela no modo "Ajustar à tela".
