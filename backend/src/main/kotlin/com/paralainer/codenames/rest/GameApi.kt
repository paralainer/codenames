package com.paralainer.codenames.rest

import com.paralainer.codenames.service.GameService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/game")
class GameApi(
    val gameService: GameService
) {

    @PostMapping
    suspend fun createGame(): ResponseEntity<Any> {
        val game = gameService.createGame()
        return CreateGameResponse(
            gameId = game.gameId,
            adminId = game.adminId
        ).let { ResponseEntity.ok(it) }
    }

    @PostMapping("/word/open")
    suspend fun openWord(@RequestBody body: OpenWordRequest): ResponseEntity<Any> {
        val game = gameService.findGame(body.gameId)
            ?: return ResponseEntity.badRequest().build()

        if (game.adminId != body.adminId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        gameService.openWord(body.gameId, body.row, body.column)

        return ResponseEntity.accepted().build()
    }

    @GetMapping("/{gameId}/a/{adminId}")
    suspend fun getAdminGame(@PathVariable gameId: String, @PathVariable adminId: String): ResponseEntity<Any> {
        val game = gameService.findGame(gameId)
            ?: return ResponseEntity.notFound().build()

        if (game.adminId != adminId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        return ResponseEntity.ok(game)
    }

    @GetMapping("/{gameId}")
    suspend fun getParticipantGame(@PathVariable gameId: String): ResponseEntity<Any> {
        val game = gameService.findParticipantGame(gameId)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(game)
    }
}

data class OpenWordRequest(
    val gameId: String,
    val adminId: String,
    val row: Int,
    val column: Int
)

data class CreateGameResponse(
    val gameId: String,
    val adminId: String
)