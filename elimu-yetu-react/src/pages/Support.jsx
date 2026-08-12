import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import validateForm from "../utils/validateForm";


function Support() {
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    subject: "",
  });

  // State for form errors
  const [errors, setErrors] = useState({});

  // State for success message
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Form submitted:", formData);
      setSuccess("Message sent successfully!");

      // reset form
      setFormData({
        name: "",
        contact: "",
        subject: "",
      });

      setErrors({});
    }
  };
  return (
    <>
      <Navbar />

      <div className="container my-3">

        <div className="row">

          {/* FAQ Section */}
          <div className="col-lg-6">
            <div className="card bg-dark mb-2">

              <div className="card-header bg-warning text-dark">
                <h4 className="faq-header">FAQs</h4>
              </div>

              <div className="card-body">

                <div className="accordion" id="faqAccordion">

                  {/* Item 1 */}
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                      >
                        What is Elimu Yetu?
                      </button>
                    </h2>

                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Elimu Yetu is a comprehensive online platform dedicated
                        to providing primary school students, parents, and teachers
                        with high-quality learning materials.
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                      >
                        Who can use Elimu Yetu?
                      </button>
                    </h2>

                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Designed for students, parents, and teachers looking for
                        quality educational resources.
                      </div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                      >
                        Is there a cost?
                      </button>
                    </h2>

                    <div
                      id="collapseThree"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Some materials on Elimu Yetu are free to access, while
                      others may require a subscription or a one-time purchase.
                      Details about the pricing will be provided on the specific
                      material's page.
                      </div>
                    </div>
                  </div>

                  {/* Item 4 */}
                   <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                      >
                       How do I upload materials to Elimu Yetu?
                      </button>
                    </h2>

                    <div
                      id="collapseFour"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                      If you are a teacher or content creator, you can upload
                      materials by clicking the "Upload materials" button at the
                      top of the homepage, logging in to your account, and
                      following the prompts to upload your resources.
                      </div>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFive"
                      >
                        Can I download the learning materials?
                      </button>
                    </h2>

                    <div
                      id="collapseFive"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                      Yes, you can download the learning materials for offline
                      use. Simply navigate to the resource you need, and click
                      on the download button provided.
                      </div>
                    </div>
                  </div>

                  {/* Item 6 */}
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSix"
                      >
                        What types of learning materials are available?
                      </button>
                    </h2>

                    <div
                      id="collapseSix"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        We offer a wide range of learning materials, including
                        lesson plans, worksheets, videos, and interactive
                        activities. These resources are designed to support
                        different learning styles and grade levels.
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-6">
            <div className="card">

              <div className="card-header bg-warning text-dark">
                <h4 className="faq-header">Leave Us a Message</h4>
              </div>

              <div className="card-body">

                <form onSubmit={handleSubmit}>
                  {success && (
                    <div className="alert alert-success">
                      {success}
                    </div>
                  )}
                 <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email or phone number</label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className={`form-control ${errors.contact ? "is-invalid" : ""}`}
                    />
                    {errors.contact && (
                      <div className="invalid-feedback">{errors.contact}</div>
                    )}
                  </div>

                 <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                    ></textarea>
                    {errors.subject && (
                      <div className="invalid-feedback">{errors.subject}</div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-warning">
                    SUBMIT
                  </button>
                </form>

              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Support;