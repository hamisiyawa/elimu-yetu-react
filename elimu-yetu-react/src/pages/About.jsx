import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import hamso from "../assets/images/hamso.jpg";

function About() {
  return (
    <>
      <Navbar />

      <div className="container my-4 py-4">

        {/* Title */}
        <h2 className="about-title text-center">About Elimu Yetu</h2>
        <div className="about-line mb-2"></div>

        {/* Content */}
        <div className="row">
          <div className="col-12">

            <h4 className="about-subtitle">Brief Introduction</h4>
            <p className="fs-6 fs-md-5 fs-lg-4">
              Welcome to Elimu Yetu, your one-stop destination for primary school
              learning materials. We provide students, parents, and teachers with
              easy access to high-quality revision papers, notes, and educational
              resources. We are dedicated to making learning simple, enjoyable,
              and effective for young learners.
            </p>

            <h4 className="about-subtitle">Mission</h4>
            <p className="fs-6 fs-md-5 fs-lg-4">
              At Elimu Yetu, our mission is to provide easy access to high-quality
              educational resources, making learning enjoyable and effective for
              primary school students.
            </p>

            <h4 className="about-subtitle">Vision</h4>
            <p className="fs-6 fs-md-5 fs-lg-4">
              Become the leading platform that empowers young learners with the
              tools and support for academic excellence.
            </p>

          </div>
        </div>

        {/* Team Section */}
        <div className="text-center py-4">
          <p className="section-title px-5">
            <span className="px-2">Our Team</span>
          </p>
          <h3 className="about-title mb-4">Top Management Team</h3>
        </div>

        <div className="row">

          {/* Team Member */}
          <div className="col-md-6 col-lg-3 text-center team mb-5">
            <div
              className="position-relative overflow-hidden mb-4"
              style={{ borderRadius: "100%" }}
            >
              <img
                className="img-fluid w-100"
                src={hamso}
                alt="team"
              />

              <div className="team-social d-flex align-items-center justify-content-center w-100 h-100 position-absolute">
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            <h4>Hamisi Yawa</h4>
            <i>Chief Technology Officer</i>
          </div>

          {/* Duplicate for others */}
          <div className="col-md-6 col-lg-3 text-center team mb-5">
            <div className="position-relative overflow-hidden mb-4" style={{ borderRadius: "100%" }}>
              <img className="img-fluid w-100" src={hamso} alt="team" />
              <div className="team-social d-flex align-items-center justify-content-center w-100 h-100 position-absolute">
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#"><i className="fab fa-twitter"></i></a>
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#"><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <h4>Hamisi Yawa</h4>
            <i>Chief Operations Officer</i>
          </div>

          <div className="col-md-6 col-lg-3 text-center team mb-5">
            <div className="position-relative overflow-hidden mb-4" style={{ borderRadius: "100%" }}>
              <img className="img-fluid w-100" src={hamso} alt="team" />
              <div className="team-social d-flex align-items-center justify-content-center w-100 h-100 position-absolute">
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#"><i className="fab fa-twitter"></i></a>
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#"><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <h4>Hamisi Yawa</h4>
            <i>Chief Content Officer</i>
          </div>

          <div className="col-md-6 col-lg-3 text-center team mb-5">
            <div className="position-relative overflow-hidden mb-4" style={{ borderRadius: "100%" }}>
              <img className="img-fluid w-100" src={hamso} alt="team" />
              <div className="team-social d-flex align-items-center justify-content-center w-100 h-100 position-absolute">
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#"><i className="fab fa-twitter"></i></a>
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#"><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-outline-light mx-2 px-0" style={{ width: "38px", height: "38px" }} href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <h4>Hamisi Yawa</h4>
            <i>Head of Digital Marketing</i>
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default About;