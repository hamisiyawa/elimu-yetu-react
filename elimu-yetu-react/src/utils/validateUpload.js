const currentYear = new Date().getFullYear();

const validateUpload = (step, formData, file, coverImage, isEditMode = false) => {
  const errors = {};

  if (step === 1) {
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (!formData.type) {
      errors.type = "Please select a material type";
    }

    if (!formData.level) {
      errors.level = "Please select an education level";
    }

    if (!formData.grade) {
      errors.grade = "Please select a grade";
    }
  }

  if (step === 2) {
    if (!formData.subject) {
      errors.subject = "Please select a subject";
    }

    if (!formData.term) {
      errors.term = "Please select a term";
    }

    if (!formData.year) {
      errors.year = "Please select a year";
    }

    if (!formData.isFree) {
      if (!formData.price || Number(formData.price) <= 0) {
        errors.price = "Please enter a valid price in KES";
      } else if (Number(formData.price) < 10) {
        errors.price = "Minimum price is KES 10";
      }
    }
  }

  if (step === 3 && !isEditMode) {
    if (!file) {
      errors.file = "Please upload a document (PDF or Word)";
    } else {
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowed.includes(file.type)) {
        errors.file = "Only PDF and Word documents are allowed";
      } else if (file.size > 10 * 1024 * 1024) {
        errors.file = "Document must be smaller than 10MB";
      }
    }

    if (coverImage) {
      const allowedImg = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedImg.includes(coverImage.type)) {
        errors.coverImage = "Cover image must be JPG, JPEG or PNG";
      } else if (coverImage.size > 2 * 1024 * 1024) {
        errors.coverImage = "Cover image must be smaller than 2MB";
      }
    }
  }

  if (step === 4 && !isEditMode) {
    if (!formData.agreement) {
      errors.agreement = "You must agree to the upload instructions";
    }
  }

  return errors;
};

export default validateUpload;