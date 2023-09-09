const Interview = require("../models/interview");
const Student = require("../models/student");

// renders the addInterview page
module.exports.addInterview = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("add_interview", {
      title: "Schedule An Interview",
    });
  }

  return res.redirect("/");
};

// creating a new interview
module.exports.create = async (req, res) => {
  try {
    const { company, date } = req.body;

    await Interview.create(
      {
        company,
        date,
      },
      (err, Interview) => {
        if (err) {
          return res.redirect("back");
        }
        return res.redirect("back");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// Enrolling student in the interview
module.exports.enrollInInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);
    const { email, result } = req.body;

    if (interview) {
      let student = await Student.findOne({ email: email });
      if (student) {
        // check if already enrolled
        let alreadyEnrolled = await Interview.findOne({
          "students.student": student.id,
        });

        // preventing student from enrolling in same company more than once
        if (alreadyEnrolled) {
          if (alreadyEnrolled.company === interview.company) {
            req.flash(
              "error",
              `${student.name} already enrolled in ${interview.company} interview!`
            );
            return res.redirect("back");
          }
        }

        let studentObj = {
          student: student.id,
          result: result,
        };

        // updating students field of interview by putting reference of newly enrolled student
        await interview.updateOne({
          $push: { students: studentObj },
        });

        // updating interview of student
        let assignedInterview = {
          company: interview.company,
          date: interview.date,
          result: result,
        };
        await student.updateOne({
          $push: { interviews: assignedInterview },
        });

        console.log(
          "success",
          `${student.name} enrolled in ${interview.company} interview!`
        );
        return res.redirect("back");
      }
      return res.redirect("back");
    }
    return res.redirect("back");
  } catch (err) {
    console.log("error", "Error in enrolling interview!");
  }
};

// deallocating students from an interview
module.exports.deallocate = async (req, res) => {
  try {
    const { studentId, interviewId } = req.params;

    // find the interview
    const interview = await Interview.findById(interviewId);

    if (interview) {
      // remove reference of student from interview schema
      await Interview.findOneAndUpdate(
        { _id: interviewId },
        { $pull: { students: { student: studentId } } }
      );

      // remove interview from student's schema using interview's company
      await Student.findOneAndUpdate(
        { _id: studentId },
        { $pull: { interviews: { company: interview.company } } }
      );
      return res.redirect("back");
    }
    return res.redirect("back");
  } catch (err) {
    console.log("error", "Couldn't deallocate from interview");
  }
};

// render edit interview page
module.exports.editInterview = async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (req.isAuthenticated()) {
    return res.render("editInterview", {
      title: "Edit Interview",
      interview_details: interview,
    });
  }

  return res.redirect("/");
};

// update interview  details
module.exports.update = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    const { company, date } = req.body;

    if (!interview) {
      return res.redirect("back");
    }

    interview.company = company;
    interview.date = date;

    interview.save();

    const StudentsInInterview = interview.students;

    // delete reference of interview from students in which these student is enrolled
    if (StudentsInInterview.length > 0) {
      for (let student of StudentsInInterview) {
        //console.log(student.student);
        const studentIndividual = await Student.findById({
          _id: student.student});
        for( let i of studentIndividual.interviews){
           // console.log(i.date)
            i.company = company;
            i.date = date;
        }
        studentIndividual.save();
       // console.log("each student", studentIndividual);
      }
    }

    return res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// Deletion of interview
module.exports.destroy = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interview = await Interview.findById(interviewId);
   // console.log("this is interviewId", interviewId);

    if (!interview) {
      return;
    }

    const StudentsInInterview = interview.students;

    // delete reference of interview from students in which these student is enrolled
    if (StudentsInInterview.length > 0) {
      for (let student of StudentsInInterview) {
        console.log('Student id',student.student)
        const st1=await Student.findOneAndUpdate(
          { _id: student.student })
        //   ,
        //   { $pull: { interviews: { company: interview.company } } }
        // );
        for(let i  of st1.interviews){
            console.log('company name',i.company)
            console.log('interview company name',interview.company)
            if(i.company==interview.company){
                console.log('company name',i)
                i.remove();
            }
        }
        st1.save();
        console.log(st1);
      }
    }

    interview.remove();
    return res.redirect("back");
  } catch (err) {
    console.log("error", err);
    return;
  }
};
