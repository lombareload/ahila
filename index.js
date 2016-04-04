var readline = require('readline'),
    fs = require('fs'),
    EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter(),
    readStream = fs.createReadStream('input.in'),
    scores = [],
    lineReader = readline.createInterface({ input: readStream });

lineReader.on('line', function(line){
    emitter.emit('data', line);
});

emitter.once('data', function(casesLine){
    var cases = parseInt(casesLine, 10);
    emitter.on('case', function(aCase){
        scores.push(aCase);
        cases = cases - 1;
        if(cases === 0){
            emitter.emit('allRead');
        }
    });
    readCases();
});

function readCases() {
    var readSummary,
        caseParts,
        inLines = 0,
        outLines = 0,
        caseScores,
        i = 0;
    emitter.on('data', function(data) {
        readSummary = i === inLines;
        if (readSummary) {
            caseParts = data.split(' ');
            inLines = parseInt(caseParts[0], 10);
            outLines = parseInt(caseParts[1], 10);
            caseScores = [];
            i = 0;
            readSummary = false;
        } else {
            var score = data.split(' '),
            points = parseInt(score[1], 10);
            caseScores.push({name: score[0], points: points});
            i++;
        }
        if(i === inLines){
            readSummary = true;
            emitter.emit('case', {outLines: outLines, caseScores: caseScores});
        }
    });
}

emitter.on('allRead', function(){
    var index = 1;
    scores.forEach(function(table){
        console.log(index);
        var position = 1;
        var pairs = [1];
        var sorted = table.caseScores.sort(function(score1, score2){
            return score1.points < score2.points;
        });

        for(var i = 1; i < table.outLines; i++){
            var equals = (sorted[i] && sorted[i].points) === (sorted[i-1] && sorted[i-1].points);
            position++;
            if(equals){
                pairs.push(pairs[pairs.length - 1]);
            } else {
                pairs.push(position);
            }
        }

        for(var i = 0; i < table.outLines; i++) {
            var score = sorted[i] || {name: '***', points: '***'};
            console.log(pairs[i] + ' ' + score.name + ' ' + score.points);
        }
        index++;
    });
});
