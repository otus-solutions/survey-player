###############################################
###               Variables                 ###
###############################################
variable "survey-player-dockerfile" {
  default = "."
}

variable "survey-player-name" {
  default = "survey-player"
}

variable "survey-player-source" {
  default = "source"
}

variable "survey-player-cleanup" {
  default = "rm -rf dist node_modules package-lock.json"
}

variable "survey-player-npminstall" {
  default = "npm install"
}

variable "survey-player-npmtest" {
  default = "npm test"
}

variable "survey-player-npmbuild" {
  default = "npm run build"
}

variable "survey-player-port"{
  default = 51001
}

variable "survey-player-activity-url"{
//  default = "/otusjs-player-data" //TODO: test local
}

variable "survey-player-staticVariable-url"{
}

variable "survey-player-datasource-url"{
}

variable "survey-player-fileUpload-url"{
}

variable "survey-player-version"{
  default = "survey-player:latest"
}
