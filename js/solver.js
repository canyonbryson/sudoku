class Solver {
    constructor(board) {
        this.board = board;
    }

    solve(data) {
        let found = 1;
        while (found > 0) {
            let candidates = this.findCandidates(data);
            found = this.solveCandidates(data, candidates);
        }
        return data;
    }

    findCandidates(data) {
        let tempData = this.board.clone_array(data);
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] == 0) {
                    tempData[i][j] = this.board.find_safe_numbers(data, i, j);
                } else {
                    tempData[i][j] = [];
                }
            }
        }
        return tempData;
    }

    solveCandidates(data, candidates) {
        let found = 0;
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (candidates[i][j].length == 1) {
                    data[i][j] = candidates[i][j][0];
                    found++;
                }
            }
        }
        return found;
    }
}