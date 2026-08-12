// Form validation function
const validateForm = (formData) => {
    let newErrors = {};

    if (!formData.name.trim()) {
        newErrors.name = "Name is required";
    }

    if (!formData.contact.trim()) {
        newErrors.contact = "Email or phone is required";
    } else if (
        !/^\S+@\S+\.\S+$/.test(formData.contact) && // email check
        !/^\d{10,}$/.test(formData.contact) // phone check (simple)
    ) {
        newErrors.contact = "Enter valid email or phone number";
    }

    if (!formData.subject.trim()) {
        newErrors.subject = "Message is required";
    }

    return newErrors;
};

export default validateForm;