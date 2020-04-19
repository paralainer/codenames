package com.paralainer.codenames.service

import com.paralainer.codenames.store.GameStore
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.*
import kotlin.random.Random

@Service
class GameService(
    private val wordsService: WordsService,
    private val gamesStore: GameStore
) {
    companion object {
        const val FieldSize = 5
    }

    suspend fun findGame(gameId: String): Game? = gamesStore.findGame(gameId)

    suspend fun findParticipantGame(gameId: String): ParticipantGame? {
        val game = findGame(gameId)
            ?: return null

        return ParticipantGame(
            gameId = game.gameId,
            lastUpdated = game.lastUpdated,
            words = game.words.map { word ->
                ParticipantWord(
                    row = word.row,
                    column = word.column,
                    value = word.value,
                    color = word.color.takeIf { word.open }
                )
            },
            redLeft = game.redLeft,
            blueLeft = game.blueLeft
        )
    }

    suspend fun createGame(): Game {
        val isRedGame = Random.nextBoolean()
        val redCount = if (isRedGame) 9 else 8
        val blueCount = if (isRedGame) 8 else 9
        val game = Game(
            gameId = UUID.randomUUID().toString(),
            adminId = UUID.randomUUID().toString(),
            words = generateGameWords(redCount, blueCount),
            lastUpdated = Instant.now().toEpochMilli(),
            blueLeft = blueCount,
            redLeft = redCount
        )
        gamesStore.saveGame(game)
        return game
    }

    suspend fun openWord(gameId: String, row: Int, column: Int): Boolean {
        val game = gamesStore.findGame(gameId)
            ?: return false
        val updatedWords = game.words.map {
            if (it.row == row && it.column == column) {
                it.copy(open = true)
            } else {
                it
            }
        }

        if (updatedWords != game.words) {
            val updatedGame = game.copy(
                words = updatedWords,
                blueLeft = updatedWords.count { it.color == WordColor.Blue && !it.open },
                redLeft = updatedWords.count { it.color == WordColor.Red && !it.open },
                lastUpdated = Instant.now().toEpochMilli()
            )
            gamesStore.saveGame(updatedGame)
        }
        return false
    }

    private fun generateGameWords(redCount: Int, blueCount: Int): List<GameWord> {
        val allWords = wordsService.allWords()
        val wordsCount = FieldSize * FieldSize
        val selectedWords = allWords.toList().shuffled().subList(0, wordsCount)
        val coloredWords = selectedWords.mapIndexed { index, word ->
            when {
                index < redCount -> word to WordColor.Red
                index < redCount + blueCount -> word to WordColor.Blue
                index < redCount + blueCount + 1 -> word to WordColor.Black
                else -> word to WordColor.Neutral
            }
        }.shuffled()

        return coloredWords.mapIndexed { index, (word, color) ->
            GameWord(
                row = index / FieldSize,
                column = index % FieldSize,
                value = word,
                open = false,
                color = color
            )
        }
    }
}

data class Game(
    val gameId: String,
    val adminId: String,
    val blueLeft: Int,
    val redLeft: Int,
    val words: List<GameWord>,
    val lastUpdated: Long
)

data class GameWord(
    val row: Int,
    val column: Int,
    val value: String,
    val open: Boolean,
    val color: WordColor
)

data class ParticipantGame(
    val gameId: String,
    val lastUpdated: Long,
    val blueLeft: Int,
    val redLeft: Int,
    val words: List<ParticipantWord>
)

data class ParticipantWord(
    val row: Int,
    val column: Int,
    val value: String,
    val color: WordColor?
)

enum class WordColor {
    Blue,
    Red,
    Black,
    Neutral
}