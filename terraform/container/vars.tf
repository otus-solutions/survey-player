###############################################
###               Variables                 ###
###############################################
variable "survey-player-port" {
  default = 51001
}

variable "survey-player-activity-url" {
  default = "http://192.168.15.39:51002/otus-rest/v01/activities"
}

variable "survey-player-staticVariable-url" {
  default = "http://192.168.15.39:51002/otus-rest/v01/static-variable"
}

variable "survey-player-datasource-url" {
  default = "http://192.168.15.39:51002/otus-rest/v01/configuration/datasources"
}

variable "survey-player-survey-url" {
  default = "http://192.168.15.39:51002/otus-rest/v01/configuration/surveys"
}

variable "survey-player-fileUpload-url" {
  default = "http://192.168.15.39:51002/otus-rest/v01/upload"
}

variable "survey-player-login-url" {
  default = "http://192.168.15.39:51002/otus-rest/v01/authentication"
}

variable "survey-player-collect-url" {
  default = "http://192.168.15.39:51002/otus-rest/v01/offline/activities/collection"
}

variable "survey-player-version" {
  default = "survey-player:latest"
}

variable "survey-player-name" {
  default = "survey-player"
}
