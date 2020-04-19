package com.paralainer.codenames

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.reactive.config.EnableWebFlux

@SpringBootApplication
@EnableWebFlux
class CodenamesApplication

fun main(args: Array<String>) {
	runApplication<CodenamesApplication>(*args)
}
