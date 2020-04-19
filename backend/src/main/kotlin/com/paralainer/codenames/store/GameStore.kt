package com.paralainer.codenames.store

import com.paralainer.codenames.service.Game
import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap

@Service
class GameStore {
    private val games: MutableMap<String, Game> = ConcurrentHashMap()

    suspend fun findGame(gameId: String): Game? = games[gameId]

    suspend fun saveGame(game: Game) {
        games[game.gameId] = game
    }
}