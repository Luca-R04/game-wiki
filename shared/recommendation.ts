export interface Recommendation {
    userName: string,
    review: {
        gameId: string,
        isPositive: boolean,
        reviewId: string,
    }
}