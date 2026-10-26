# cloud-so-app — Informações do Sistema Operacional

Aplicação web desenvolvida com Node.js e Express para consultar e apresentar informações básicas do sistema operacional em que o servidor está sendo executado.

## 1. Visão geral do projeto

O cloud-so-app é uma aplicação web que disponibiliza informações técnicas do ambiente de execução do servidor por meio de uma página HTML acessível pelo navegador.

O sistema utiliza o módulo nativo os do Node.js para coletar dados sobre o sistema operacional, processador, memória e tempo de atividade. O framework Express é responsável por disponibilizar essas informações por meio de uma rota HTTP.

A interface apresenta os dados em um painel organizado, facilitando a visualização e a compreensão das características do ambiente em que a aplicação está hospedada.

## 2. Objetivo

O objetivo do projeto é desenvolver uma aplicação web simples para monitoramento informativo dos principais recursos e características do sistema operacional de um servidor.

A aplicação também pode ser utilizada como exemplo prático de desenvolvimento com Node.js e Express, integração com módulos nativos da plataforma e disponibilização de informações por meio de uma interface web.

## 3. Problema que o projeto pretende resolver

Em ambientes de desenvolvimento, testes e hospedagem em nuvem, pode ser necessário verificar rapidamente informações sobre o sistema operacional no qual uma aplicação está sendo executada.

A consulta dessas informações normalmente exige acesso ao terminal do servidor e a execução de comandos específicos de cada sistema operacional.

O cloud-so-app busca simplificar essa consulta ao reunir os dados em uma única página web, permitindo visualizar as principais informações sem executar comandos manualmente no terminal.

## 4. Escopo da aplicação

### 4.1 Funcionalidades incluídas

- Identificação do nome do host do servidor.
- Exibição da plataforma do sistema operacional.
- Identificação da arquitetura do processador.
- Exibição da quantidade de CPUs lógicas identificadas pelo Node.js.
- Consulta da memória total do sistema.
- Consulta da memória livre do sistema.
- Exibição do tempo de atividade do sistema operacional.
- Formatação dos valores para facilitar a leitura.
- Apresentação das informações em uma interface HTML com CSS.
- Disponibilização da aplicação por meio de um servidor HTTP.

### 4.2 Funcionalidades fora do escopo atual

A versão atual não implementa:

- Autenticação ou controle de acesso.
- Monitoramento histórico de métricas.
- Atualização automática dos dados no navegador.
- Armazenamento em banco de dados.
- Alertas de consumo de recursos.
- Gráficos de desempenho.
- Monitoramento de múltiplos servidores.
- API independente que retorne os dados em JSON.

Essas funcionalidades poderão ser incorporadas em versões futuras, conforme a evolução dos requisitos.

## 5. Requisitos do sistema

### 5.1 Requisitos funcionais

ID	Requisito	Descrição
| ID | Requisito | Descrição |
|---|---|---|
| RF01 | Consultar host | Obter o nome do host utilizando os.hostname(). |
| RF02 | Identificar plataforma | Obter a plataforma utilizando os.platform(). |
| RF03 | Identificar arquitetura | Obter a arquitetura utilizando os.arch(). |
| RF04 | Consultar CPUs | Obter a quantidade de processadores lógicos utilizando os.cpus(). |
| RF05 | Consultar memória total | Obter a memória total com os.totalmem(). |
| RF06 | Consultar memória livre | Obter a memória livre com os.freemem(). |
| RF07 | Consultar atividade | Obter o tempo de atividade com os.uptime(). |
| RF08 | Formatar informações | Converter bytes em gigabytes e segundos em horas, minutos e segundos. |
| RF09 | Exibir informações | Apresentar os dados em uma página HTML acessível pela rota principal. |
| RF10 | Disponibilizar servidor | Iniciar um servidor HTTP na porta configurada. |

### 5.2 Requisitos não funcionais

RNF01 — Usabilidade: apresentar as informações de maneira clara, organizada e legível.
RNF02 — Desempenho: responder às requisições com baixo custo computacional, sem processamento complexo ou consultas a bancos de dados.
RNF03 — Compatibilidade: utilizar recursos disponíveis no Node.js e navegadores modernos.
RNF04 — Manutenibilidade: manter o código organizado em funções de formatação, coleta de dados e atendimento HTTP.
RNF05 — Portabilidade: permitir a execução em sistemas operacionais compatíveis com Node.js.
RNF06 — Disponibilidade: disponibilizar a interface enquanto o processo do servidor estiver em execução.
RNF07 — Segurança: considerar que informações sobre o host, a plataforma e os recursos do servidor podem ser sensíveis e restringir o acesso quando necessário.
RNF08 — Configurabilidade: permitir ajustar a porta de execução sem modificar diretamente o código, por meio de variável de ambiente em uma evolução da implementação.
## 6. Tecnologias utilizadas

Node.js

Ambiente de execução JavaScript utilizado no servidor. Permite executar a lógica da aplicação fora do navegador e acessar informações do sistema operacional.

Express

Framework web para Node.js utilizado para configurar o servidor HTTP, definir a rota principal e enviar o conteúdo HTML ao cliente.

Módulo nativo os

Módulo do Node.js responsável pela obtenção das informações do sistema operacional, como nome do host, plataforma, arquitetura, memória e tempo de atividade.

HTML5

Linguagem de marcação utilizada para estruturar a página e apresentar os dados coletados pelo servidor.

CSS3

Tecnologia utilizada para estilizar a interface, incluindo cores, espaçamentos, alinhamento, bordas e sombras.

JavaScript

Linguagem utilizada para implementar a lógica do servidor, coletar as informações e formatar os valores exibidos.

Git e GitHub

Ferramentas recomendadas para versionamento do código-fonte, colaboração e hospedagem do repositório do projeto.

## 7. Arquitetura da aplicação

A aplicação utiliza uma arquitetura web cliente-servidor simplificada, organizada em três responsabilidades principais:

- Coleta de dados: o módulo os fornece as informações do ambiente de execução.
- Processamento e apresentação: o servidor utiliza funções JavaScript para formatar os valores e construir o documento HTML.
- Comunicação HTTP: o Express recebe as requisições e devolve a página ao navegador.
- Fluxo de funcionamento

```
Usuário
   |
   v
Navegador Web
   |
   | Requisição HTTP GET /
   v
Servidor Express
   |
   v
Coleta de informações
   |
   +--> os.hostname()
   +--> os.platform()
   +--> os.arch()
   +--> os.cpus()
   +--> os.totalmem()
   +--> os.freemem()
   +--> os.uptime()
   |
   v
Formatação dos dados
   |
   v
Geração do HTML
   |
   v
Resposta HTTP
   |
   v
Página com informações do sistema
```

A aplicação não utiliza uma API externa nem um banco de dados. Os dados são coletados durante o processamento de cada requisição à rota principal.

## 8. Organização dos componentes

Na implementação atual, todos os componentes estão concentrados em um único arquivo JavaScript.

Componente	Responsabilidade
require('express')	Importar o framework responsável pelo servidor HTTP.
require('os')	Importar o módulo de consulta ao sistema operacional.
formatBytes(bytes)	Converter bytes em gigabytes, com duas casas decimais.
formatUptime(seconds)	Converter segundos em horas, minutos e segundos.
app.get('/')	Processar as requisições HTTP para a página inicial.
Template HTML	Estruturar e apresentar os dados coletados.
CSS incorporado	Definir o estilo visual da página.
app.listen()	Iniciar o servidor na porta configurada.
### Estrutura de diretórios recomendada

Para a versão atual, basta um arquivo JavaScript e o arquivo de documentação:

```
cloud-so-app/
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

O arquivo server.js deve conter o código fornecido. O arquivo package.json registra as dependências e os comandos do projeto. O package-lock.json é gerado pelo npm para registrar as versões resolvidas das dependências.

## 9. Pré-requisitos

Antes de executar o projeto, é necessário possuir:

- Node.js instalado em uma versão LTS compatível.
- npm, normalmente instalado junto com o Node.js.
- Git, caso o código seja obtido por meio de um repositório remoto.
- Navegador web moderno.
- Porta TCP disponível para receber as conexões, utilizando a porta 3000 por padrão.

Para verificar as instalações, execute:

```bash
node --version
npm --version
git --version
```

O último comando é necessário apenas para operações com Git.

## 10. Instalação e configuração

### 10.1 Obter o código-fonte

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd cloud-so-app
```

Substitua <URL_DO_REPOSITORIO> pelo endereço real do repositório GitHub.

Caso o projeto já esteja na máquina, entre diretamente no diretório correspondente.

### 10.2 Inicializar o projeto

Se o repositório ainda não possuir um package.json, execute:

```bash
npm init -y
```

Instale o Express:

```bash
npm install express
```

O módulo os é nativo do Node.js e não precisa ser instalado separadamente.

### 10.3 Configurar o comando de execução

No arquivo package.json, configure o script de inicialização:

```json
{
  "name": "cloud-so-app",
  "version": "1.0.0",
  "description": "Aplicação web para exibição de informações do sistema operacional",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^5.1.0"
  }
}
```

Esse exemplo pressupõe Express 5.1.0 ou uma versão compatível com o intervalo declarado. Se o npm tiver instalado outra versão, preserve a versão efetivamente registrada no package.json e no package-lock.json, em vez de substituir os arquivos sem necessidade.

Salve o código da aplicação no arquivo server.js.

## 11. Execução do projeto

No terminal, dentro do diretório do projeto, execute:

```bash
npm start
```

Se a inicialização ocorrer corretamente, será exibida uma mensagem semelhante a:

```
Servidor rodando em http://localhost:3000
```

Abra o navegador e acesse:

http://localhost:3000

A página apresentará as informações do sistema operacional do ambiente em que o processo Node.js estiver sendo executado.

Para interromper o servidor, utilize Ctrl + C no terminal.

### Execução em outro ambiente

Se a aplicação for executada em uma máquina virtual, contêiner ou servidor remoto, os dados exibidos corresponderão ao ambiente de execução visível ao Node.js, e não necessariamente ao computador utilizado pelo navegador.

Em ambientes conteinerizados, por exemplo, algumas informações de memória podem refletir o sistema hospedeiro, e não os limites efetivos de memória do contêiner.

## 12. Documentação da API HTTP

A versão atual oferece uma rota HTTP.

### `GET /`

Descrição: retorna uma página HTML com as informações do sistema operacional.

Parâmetros: nenhum parâmetro de consulta ou de caminho é necessário.

Cabeçalhos: o navegador normalmente envia Accept: text/html; não há cabeçalhos personalizados obrigatórios.

Resposta de sucesso: 200 OK, com conteúdo HTML.

Tipo de conteúdo esperado: text/html; charset=utf-8 ou equivalente, conforme o comportamento do Express.

Exemplo de chamada com curl:

```bash
curl -i http://localhost:3000/
```

Exemplo ilustrativo dos dados apresentados:

```
Nome do Host: servidor-exemplo
Plataforma: linux
Arquitetura: x64
Quantidade de CPUs: 4
Memória Total: 8.00 GB
Memória Livre: 3.25 GB
Tempo de Atividade: 12h 30m 15s
```

Os valores acima são fictícios e servem apenas para ilustrar a resposta visual. Os dados reais variam de acordo com o ambiente de execução.

### Outras rotas

A aplicação não define rotas adicionais. Uma requisição para um caminho não implementado normalmente receberá uma resposta de erro HTTP 404 do Express.

## 13. Banco de dados

A versão atual não utiliza banco de dados.

As informações são obtidas diretamente do sistema operacional a cada requisição e apresentadas ao usuário sem persistência.

Caso seja necessário manter um histórico de métricas, poderão ser avaliadas alternativas como SQLite, PostgreSQL ou um sistema de monitoramento especializado. Essa inclusão exigiria novos requisitos, modelos de dados e procedimentos de persistência.

## 14. Variáveis de ambiente

Na implementação original, a porta está definida diretamente no código:

```javascript
const PORT = 3000;
```

Portanto, a variável de ambiente PORT ainda não é utilizada.

Para permitir configuração por ambiente, recomenda-se substituir a declaração por:

```javascript
const PORT = Number(process.env.PORT) || 3000;
```

Depois dessa alteração, o servidor poderá ser iniciado com uma porta personalizada.

### Linux ou macOS:

```bash
PORT=8080 npm start
```

### PowerShell:

```powershell
$env:PORT = "8080"
npm start
```

A documentação das variáveis de ambiente deve ser atualizada conforme novas configurações forem implementadas. Não há necessidade de criar um arquivo .env para a versão original, pois ela não utiliza variáveis externas.

## 15. Testes

A versão inicial não possui testes automatizados configurados. Recomenda-se executar os seguintes testes manuais após a instalação.

### 15.1 Teste de inicialização

Execute:

```bash
npm start
```

Resultado esperado: o servidor inicia sem erros e informa o endereço de execução.

### 15.2 Teste da rota principal

Execute:

```bash
curl -i http://localhost:3000/
```

Resultado esperado: resposta HTTP de sucesso e conteúdo HTML contendo o título “Informações do Sistema”.

### 15.3 Teste das informações

Acesse a aplicação pelo navegador e verifique se são apresentados:

- Nome do host.
- Plataforma.
- Arquitetura.
- Quantidade de CPUs.
- Memória total.
- Memória livre.
- Tempo de atividade.

Compare os dados com os comandos ou ferramentas equivalentes do sistema operacional, considerando diferenças entre ambientes nativos e contêineres.

### 15.4 Teste de formatação

Verifique se os valores de memória são exibidos com duas casas decimais e se o tempo de atividade apresenta horas, minutos e segundos.

### 15.5 Teste de rota inexistente

Execute:

```bash
curl -i http://localhost:3000/rota-inexistente
```

Resultado esperado: resposta HTTP 404.

### 15.6 Melhorias recomendadas para testes automatizados

Em uma evolução do projeto, recomenda-se utilizar:

Node.js test runner ou Jest para testes automatizados.
Supertest para testar as rotas HTTP.
Testes unitários das funções formatBytes() e formatUptime().
Testes de integração para verificar a resposta da rota principal.
Testes de configuração para confirmar o comportamento da variável PORT.

Essas ferramentas são sugestões para futuras implementações, não dependências já presentes no código fornecido.

## 16. Segurança e boas práticas

A aplicação apresenta informações internas do servidor, como hostname, arquitetura, plataforma e disponibilidade de memória. Embora sejam informações úteis para diagnóstico, sua exposição pública pode facilitar o reconhecimento do ambiente por terceiros.

Recomenda-se:

- Restringir o acesso à aplicação em ambientes de produção, quando os dados não forem públicos.
- Utilizar HTTPS quando houver acesso por redes externas.
- Não expor informações adicionais sensíveis em mensagens de erro.
- Manter Node.js e Express atualizados.
- Utilizar um arquivo package-lock.json versionado para facilitar instalações reproduzíveis.
- Configurar controles de acesso na infraestrutura ou na aplicação quando necessário.
- Não considerar a página como um mecanismo completo de monitoramento ou segurança.
- Avaliar as diferenças de memória e CPU em ambientes conteinerizados.
- Observação sobre a geração de HTML

Os valores são inseridos diretamente no template HTML. Como o hostname é obtido do ambiente de execução, é recomendável escapar adequadamente os dados dinâmicos antes de inseri-los no HTML, principalmente caso a aplicação passe a aceitar valores fornecidos por usuários ou por fontes externas.

## 17. Deploy

A aplicação pode ser executada em uma máquina virtual, servidor Linux, contêiner Docker ou plataforma de hospedagem compatível com Node.js.

### 17.1 Deploy em servidor Linux

- Instale uma versão compatível do Node.js.
- Obtenha o código-fonte.
- Execute npm ci se houver um package-lock.json válido e versionado; caso contrário, utilize npm install.
- Configure a porta e as regras de rede.
- Inicie o serviço com npm start.
- Utilize um gerenciador de processos, como systemd ou PM2, para manter o processo sob supervisão.
- Se houver exposição externa, configure um proxy reverso e HTTPS conforme a infraestrutura.

### 17.2 Deploy em contêiner

O projeto também pode ser empacotado em uma imagem Docker. Nesse caso, recomenda-se utilizar uma imagem oficial do Node.js, instalar somente as dependências necessárias e expor a porta configurada.

O arquivo Dockerfile e os comandos de construção da imagem deverão ser adicionados ao repositório quando essa forma de deploy for adotada.

### 17.3 Considerações para hospedagem em nuvem

Antes de publicar a aplicação, verifique se a plataforma de hospedagem exige que o servidor escute em uma porta fornecida por variável de ambiente e se o processo deve escutar em uma interface de rede acessível externamente.

O projeto original fixa a porta em 3000. Para ambientes que fornecem uma porta dinâmica, implemente a leitura de process.env.PORT conforme descrito na seção de configuração.

O deploy não deve ser considerado concluído até que a aplicação esteja acessível no ambiente de destino e os testes básicos tenham sido executados.

## 18. Limitações conhecidas

Os dados são coletados somente quando ocorre uma requisição à página.
Não existe atualização automática da interface.
Não há persistência de dados nem histórico.
A interface não apresenta gráficos.
Não há autenticação integrada.
A aplicação não implementa monitoramento de múltiplos hosts.
Os dados de memória e CPU podem não representar os limites efetivos de recursos de um contêiner.
A quantidade de CPUs representa os processadores lógicos retornados por os.cpus(), não necessariamente o número de CPUs físicas disponíveis.
A aplicação não substitui uma solução completa de observabilidade ou monitoramento.
## 19. Possíveis melhorias futuras

Entre as melhorias que podem ser consideradas estão:

- Atualização periódica dos dados sem recarregar a página.
- Endpoint JSON, por exemplo GET /api/system, para integração com outros sistemas.
- Separação entre rotas, serviços de coleta e camada de apresentação.
- Interface responsiva aprimorada e gráficos de utilização.
- Registro histórico de métricas.
- Autenticação e autorização.
- Testes unitários e de integração automatizados.
- Containerização com Docker.
- Pipeline de integração e entrega contínuas (CI/CD).
- Monitoramento de disponibilidade e tratamento estruturado de erros.

## 20. Conclusão

O cloud-so-app demonstra como construir uma aplicação web simples utilizando Node.js, Express e módulos nativos da plataforma. O sistema centraliza a consulta de informações básicas do ambiente de execução em uma interface HTML acessível por navegador.

Sua estrutura reduzida facilita a instalação, o entendimento e a manutenção, servindo como ponto de partida para aplicações de diagnóstico de servidores e projetos introdutórios de computação em nuvem.

A evolução para ambientes de produção deverá considerar segurança, configuração por ambiente, testes automatizados, supervisão do processo e as limitações de coleta de recursos em infraestruturas virtualizadas.

## 21. Licença

Nenhuma licença foi informada no código-fonte fornecido. Antes de distribuir o projeto publicamente, escolha e adicione uma licença adequada ao repositório, caso aplicável.

Projeto: cloud-so-app
Tecnologias principais: Node.js, Express, JavaScript, HTML5 e CSS3
Finalidade: exibição web de informações do sistema operacional
Versão da documentação: 1.0
