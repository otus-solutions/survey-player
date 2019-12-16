
###############################################
###  OTUS : Build Image Front-End           ###
###############################################
resource "null_resource" "survey-player-cleanup" {
  provisioner "local-exec" {
    working_dir = var.survey-player-source
    command = var.survey-player-cleanup
  }
}

resource "null_resource" "survey-player-install" {
depends_on = [null_resource.survey-player-cleanup]
  provisioner "local-exec" {
    working_dir = var.survey-player-source
    command = var.survey-player-npminstall
  }
}

resource "null_resource" "survey-player-test" {
depends_on = [null_resource.survey-player-install]
  provisioner "local-exec" {
    working_dir = var.survey-player-source
    command = var.survey-player-npmtest
  }
}

resource "null_resource" "survey-player-build" {
depends_on = [null_resource.survey-player-test]
  provisioner "local-exec" {
    working_dir = var.survey-player-source
    command = var.survey-player-npmbuild
  }
}


resource "null_resource" "survey-player" {
depends_on = [null_resource.survey-player-build]
  provisioner "local-exec" {
    command = "docker build -t ${var.survey-player-name} ${var.survey-player-dockerfile}"
  }
}
