import readline from 'readline';
import mysql from 'mysql2';
import { stdin, stdout } from 'process';

const rl = readline.createInterface({
    input: stdin,
    output: stdout,
})

let pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "school",
}).promise();


function ask(ques){
    return new Promise((resolve) => {
        rl.question(ques, ans => resolve(ans));
    })
}
let name = await ask("What?");
console.log(typeof(name));

function getDetails() {
    let StudentName; 
    let CollegeName; 
    let Round1Marks; 
    let Round2Marks; 
    let Round3Marks; 
    let TechnicalRoundMarks;

    try{
        StudentName = ask("Enter StudentName:")
        CollegeName = ask("Enter CollegeName:")
        Round1Marks = parseFloat(ask("Enter Round1Marks:"))
        Round2Marks = parseFloat(ask("Enter Round2Marks:"))
        Round3Marks = parseFloat(ask("Enter SNRound3Marksame:"))
        TechnicalRoundMarks = parseFloat(ask("Enter TechnicalRoundMarks:"))

        return [StudentName, CollegeName, Round1Marks, Round2Marks, Round3Marks, TechnicalRoundMarks];
    }
    catch(e){
        return false;
    }
}

async function main(){
    let totStudents = parseInt(ask("Number of students: "))

    while(totStudents !== 0){
        let details = getDetails();
        if(details !== false){
            let [StudentName, CollegeName, Round1Marks, Round2Marks, Round3Marks, TechnicalRoundMarks] = details;
            if(Round1Marks < 0 || Round1Marks > 10){
                continue;
            }
            else if(Round2Marks < 0 || Round2Marks > 10){
                continue;
            }
            else if(Round3Marks < 0 || Round3Marks > 10){
                continue;
            }
            else if(TechnicalRoundMarks < 0 || TechnicalRoundMarks > 20){
                continue;
            }
            else {
                let result = await pool.query('INSERT INTO student (StudentName, CollegeName, Round1Marks, Round2Marks, Round3Marks, TechnicalRoundMarks) VALUES (?, ?, ?, ?, ?, ?)', 
                    [StudentName, CollegeName, Round1Marks, Round2Marks, Round3Marks, TechnicalRoundMarks]);
                console.log("Inserted successfully");
                totStudents--;
            }
        }
    }

    //Displaying all students
    let result = await pool.query('SELECT * FROM student'); 
    let [rows] = result;
    console.log("All Students:");
    rows.forEach(row => {
        console.log(`Name: ${row.StudentName}, College: ${row.CollegeName}, Round 1: ${row.Round1Marks}, Round 2: ${row.Round2Marks}, Round 3: ${row.Round3Marks}, Technical: ${row.TechnicalRoundMarks}`);
    });

    rl.close();
}

main();




