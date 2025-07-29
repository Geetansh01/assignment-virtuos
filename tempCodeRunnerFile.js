llegeName = await ask("Enter CollegeName: ");
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