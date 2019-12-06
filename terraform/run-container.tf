resource "docker_container" "survey-player" {
  name = var.survey-player-name
  image = var.survey-player-version
  env = [
    "ACTIVITY_URL=${var.survey-player-activity-url}",
    "DATASOURCE_URL=${var.survey-player-datasource-url}",
    "STATIC_VARIABLE_URL=${var.survey-player-staticVariable-url}",
    "FILE_UPLOAD_URL=${var.survey-player-fileUpload-url}"
  ]
  ports {
	internal = 80
	external = var.survey-player-port
  }
  depends_on = [null_resource.survey-player]
}
