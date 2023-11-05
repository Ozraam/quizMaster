import { Server } from 'socket.io'
import { Room } from './Room'
import { Answer, Quiz } from '~/utils/types'

export class Game {
    quizId : string
    quiz : Quiz
    usersAnswers : Map<number, Map<number, number>> = new Map()
    currentQuestion = 0

    timeToAnswer = 10

    constructor(quizId : string) {
        this.quizId = quizId
        const tempQuiz = useDatabase().dbManager.getQuiz(quizId)

        if (tempQuiz) {
            this.quiz = tempQuiz
        } else {
            throw new Error('Quiz not found')
        }
    }

    sendQuestion(room: Room, io: Server) {
        const question = this.quiz.questions[this.currentQuestion]
        const sendQuestion = { ...question, index: this.currentQuestion + 1 }
        sendQuestion.answers = sendQuestion.answers.map((answer: Answer) => {
            return {
                id: answer.id,
                answer: answer.answer
            } as Answer
        })
        io.to(room.id.toString()).emit('question', sendQuestion)
        setTimeout(() => {
            this.requestAnswers(room, io)
        }, this.timeToAnswer * 1000)
    }

    requestAnswers(room: Room, io: Server) {
        io.to(room.id.toString()).emit('requestAnswer')
    }

    nextQuestion(room: Room, io: Server) {
        if (this.currentQuestion + 1 < this.quiz.questions.length) {
            this.currentQuestion++
            this.sendQuestion(room, io)
        } else {
            this.endGame(room, io)
        }
    }

    endGame(room: Room, io: Server) {
        room.status = RoomStatus.Ended
        io.to(room.id.toString()).emit('gameEnded')
    }

    setUsersAnswers(userId: number, questionId: number, answers: number, room: Room, io: Server) {
        const usersAnswers = this.usersAnswers.get(questionId) || new Map()
        usersAnswers.set(userId, answers)
        this.usersAnswers.set(questionId, usersAnswers)

        if (usersAnswers.size === room.users.length) {
            this.nextQuestion(room, io)
        }
    }

    sendResults(room: Room, io: Server) {
        const results = this.getResults()

        io.to(room.id.toString()).emit('sendresults', results)
    }

    getResults() {
        const results : Map<number, number> = new Map()

        this.usersAnswers.forEach((usersAnswers, questionId) => {
            usersAnswers.forEach((answer, userId) => {
                const userScore = results.get(userId) || 0
                const answerObject = this.quiz.questions[questionId].answers.find((a: Answer) => a.id === answer)

                if (answerObject && answerObject.isCorrect) {
                    results.set(userId, userScore + 1)
                } else {
                    results.set(userId, userScore)
                }
            })
        })

        return results
    }
}
