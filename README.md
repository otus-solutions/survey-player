#SURVEY-PLAYER

Para iniciar utilize o comandos: <br>
```bash
terraform init terraform/
```
Após, utilize o comando
```bash
terraform apply terraform/
```

Preencha a variável _**var.survey-player-activity-url**_ com o valor "/otusjs-player-data" para buscar localmente uma atividade demo.


Insira na url os seguintes parametros
- activity (identificador da atividade a ser buscada)
- token (autorização da api)
- callback (url para onde deverá ser redirecionado ao sair)


Exemplo para demo local:
[Clique aqui](http://localhost:51001/#/?activity=survey.json&token=123&callback=google.com)
