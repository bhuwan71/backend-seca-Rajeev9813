const path = require("path");
const courseModel = require("../models/courseModel");
const fs = require("fs");

const createCourse = async (req, res) => {

  // Destructuring the body data (json)
  const { courseName, coursePrice, courseCategory, courseDescription } =
    req.body;

  // Validation (Task)
  if (!courseName || !coursePrice || !courseCategory || !courseDescription) {
    return res.status(400).json({
      success: false,
      message: "Enter all fields!",
    });
  }



  // const { courseImage } = req.files;

  // upload image
  // 1. Generate new image name (abc.png) -> (213456-abc.png)
  // const imageName = `${Date.now()}-${courseImage.name}`;

  // 2. Make a upload path (/path/uplad - directory)
  // const imageUploadPath = path.join(__dirname, `../public/course/${imageName}`);

  // 3. Move to that directory (await, try-catch)
  try {
    // await courseImage.mv(imageUploadPath);

    //saving to database
    const newCourse = new courseModel({
      courseName: courseName,
      coursePrice: coursePrice,
      courseCategory: courseCategory,
      courseDescription: courseDescription,
      // courseImage: imageName,
    });

    const course = await newCourse.save();
    res.status(201).json({
      success: true,
      message: "Course created successfully!",
      data: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error,
    });
  }
};

//fetch all course
const getAllCourse = async (req, res) => {
  //try catch for error
  try {
    const allCourse = await courseModel.find({});
    res.status(200).json({
      success: true,
      message: "Course fetched successfully!",
      course: allCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error,
    });
  } // then check into postman either it shows the created course or not.

  //fetch all course
  // const course = await courseModel.find();
  // res.status(200).json({
  //     "success": true,
  //     "message" : "Course fetched successfully!",
  //     "data" : course
  // })
};

//fetch single course
const getSingleCourse = async (req, res) => {
  //get course id from url(params)
  const courseId = req.params.id;

  //find course by id from try catch
  try {
    const course = await courseModel.findById(courseId);
    res.status(201).json({
      success: true,
      message: "Course fetched successfully!",
      course: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error,
    });
  }
};

//Delete Course

const deleteCourse = async (req, res) => {
  try {
    await courseModel.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: "Course deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error,
    });
  }
};

//update Course

//steps
//1. get course id
//2. if image is there,
//3. new image should be uploaded and
//4. old image should be removed.
//5. find course(database) courseImage
//6. find that image in directory
//7. delete
//8. update course by id

const updateCourse = async (req, res) => {
  // check incomming data
  console.log(req.body);
  console.log(req.files);
  try {
    //if there is image
    if (req.files) {
      //destructuring
      const { courseImage } = req.files;
      //upload image to /public/course
      const imageName = `${Date.now()}-${courseImage.name}`;
      // 2. Make a upload path (/path/uplad - directory)
      const imageUploadPath = path.join(
        __dirname,
        `../public/course/${imageName}`
      );
      // 3. Move to folder
      await courseImage.mv(imageUploadPath);
      //req.params (id), req.body(updated data, courseName,coursePrice,courseCategory,courseDescription), req.files(courseImage)
      //add new field to req.body
      req.body.courseImage = imageName;

      //if image is uploaded and req.body is assigned
      if (req.body.courseImage) {
        //Finding existing course
        const existingCourse = await courseModel.findById(req.params.id);

        //Searching in directory/folders
        const oldImagePath = path.join(
          __dirname,
          `../public/course/${existingCourse.Image}`
        );

        //delete from filesystem (fs)
        fs.unlinkSync(oldImagePath);
      }
    }

    //Update the data
    const updatedCourse = await courseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "Course updated successfully!",
      course: updatedCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error,
    });
  }
};

module.exports = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  deleteCourse,
  updateCourse,
};
