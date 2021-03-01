resource "null_resource" "network-creation" {
  provisioner "local-exec" {
    command = "docker network create ${var.survey-player-network}"
    on_failure = continue
  }
}

resource "null_resource" "survey-player-container-removal" {
  provisioner "local-exec" {
    command = "docker stop survey-player"
    on_failure = continue
  }
  provisioner "local-exec" {
    command = "docker rm survey-player"
    on_failure = continue
  }
}

resource "docker_container" "survey-player" {
  depends_on = [null_resource.network-creation, null_resource.survey-player-container-removal]
  name = var.survey-player-name
  image = var.survey-player-version
  env = [
    "ACTIVITY_URL=${var.survey-player-activity-url}",
    "DATASOURCE_URL=${var.survey-player-datasource-url}",
    "STATIC_VARIABLE_URL=${var.survey-player-staticVariable-url}",
    "FILE_UPLOAD_URL=${var.survey-player-fileUpload-url}",
    "LOGIN_URL=${var.survey-player-login-url}",
    "SURVEY_URL=${var.survey-player-survey-url}",
    "COLLECT_URL=${var.survey-player-collect-url}"
  ]
  ports {
    internal = 80
    external = var.survey-player-port
  }
  networks_advanced {
    name = var.survey-player-network
  }
}
