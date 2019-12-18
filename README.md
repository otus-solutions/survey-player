# SURVEY-PLAYER

## Build Image

```bash
terraform init terraform/image/
terraform apply terraform/image/
```

## Run Container
```bash
terraform init terraform/image/
terraform apply terraform/image/
```

Preencha a variável _**var.survey-player-activity-url**_ com o valor "/otusjs-player-data" para buscar localmente uma atividade demo.

```bash
terraform apply -var survey-player-activity-url="/otusjs-player-data" terraform/image/
```

Insira na url os seguintes parametros
- activity (identificador da atividade a ser buscada)
- token (autorização da api)
- callback (url para onde deverá ser redirecionado ao sair)


Exemplo para demo local:
[Clique aqui](http://localhost:51001/#/?activity=survey.json&token=123&callback=google.com)
