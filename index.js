import readline from 'readline';
import mysql from 'mysql2';
import { stdin, stdout } from 'process';

const rl = readline.createInterface({
    input: stdin,
    output: stdout,
});

let pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "school",
}).promise();

function ask(ques) {
    return new Promise((resolve) => {
        rl.question(ques, ans => resolve(ans));
    });
}

async function getDetails() {
    try {
        let StudentName = await ask("Enter StudentName: ");
        let CollegeName = await ask("Enter CollegeName: ");
        let Round1Marks = parseFloat(await ask("Enter Round1Marks (0-10): "));
        let Round2Marks = parseFloat(await ask("Enter Round2Marks (0-10): "));
        let Round3Marks = parseFloat(await ask("Enter Round3Marks (0-10): "));
        let TechnicalRoundMarks = parseFloat(await ask("Enter TechnicalRoundMarks (0-20): "));

        // Validation
        if (
            Number.isNaN(Round1Marks) || Round1Marks < 0 || Round1Marks > 10 ||
            Number.isNaN(Round2Marks) || Round2Marks < 0 || Round2Marks > 10 ||
            Number.isNaN(Round3Marks) || Round3Marks < 0 || Round3Marks > 10 ||
            Number.isNaN(TechnicalRoundMarks) || TechnicalRoundMarks < 0 || TechnicalRoundMarks > 20
        ) {
            console.log("Invalid marks entered.");
            return false;
        }

        return [StudentName, CollegeName, Round1Marks, Round2Marks, Round3Marks, TechnicalRoundMarks];
    } catch (e) {
        return false;
    }
}

function sortByTotalMarks(student1, student2) {
    let student1_total = parseFloat(student1.Round1Marks) + parseFloat(student1.Round2Marks) + parseFloat(student1.Round3Marks) + parseFloat(student1.TechnicalRoundMarks);
    let student2_total = parseFloat(student2.Round1Marks) + parseFloat(student2.Round2Marks) + parseFloat(student2.Round3Marks) + parseFloat(student2.TechnicalRoundMarks);
    return student2_total - student1_total;
}

async function main() {
    let totStudents = parseInt(await ask("Number of students: "));

    while (totStudents > 0) {
        let details = await getDetails();
        if (details !== false) {
            let [StudentName, CollegeName, Round1Marks, Round2Marks, Round3Marks, TechnicalRoundMarks] = details;

            await pool.query(
                'INSERT INTO student (StudentName, CollegeName, Round1Marks, Round2Marks, Round3Marks, TechnicalRoundMarks) VALUES (?, ?, ?, ?, ?, ?)',
                [StudentName, CollegeName, Round1Marks, Round2Marks, Round3Marks, TechnicalRoundMarks]
            );

            console.log("Inserted successfully");
            totStudents--;
        }
    }

    // Display all students with computed Total, Result and Rank
    let [rows] = await pool.query('SELECT * FROM student');

    rows.sort(sortByTotalMarks);
    let rank = 1;
    for(let i = 0; i < rows.length; i++){
        // console.log(rows[i]);
        const total = parseFloat(rows[i].Round1Marks) + parseFloat(rows[i].Round2Marks) + parseFloat(rows[i].Round3Marks) + parseFloat(rows[i].TechnicalRoundMarks);
        rows[i].total = total;

        //Get the rank
        if(i > 0){
            if(total !== rows[i-1].total){
                rank++;
            }
        }
        const result = total < 35 ? "Rejected" : "Selected";
        console.log(
            `#Rank: ${rank}  Name: ${rows[i].StudentName}, College: ${rows[i].CollegeName}, Total: ${total}, Result: ${result}`
        );
    };

    console.log("Closing!");
    rl.close();
    await pool.end();
}

main();
