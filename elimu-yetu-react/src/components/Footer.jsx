import facebook from "../assets/images/facebook.png";
import instagram from "../assets/images/instagram.png";
import twitter from "../assets/images/twitter.png";
function Footer() {
    return (
        <>
            <footer className="bg-dark text-white text-center pt-4">

                <div className="container">

                    <div className="row">

                        <div className="col-md-4">

                            <h5 className="about-footer">About Elimu Yetu</h5>

                            <p className="fs-6 fs-md-5 fs-lg-4">
                                Welcome to LearnEasy, your one-stop destination for primary school
                                learning materials. Our mission is to provide students, parents,
                                and teachers with easy access to high-quality revision papers,
                                notes, and educational resources. We are dedicated to making
                                learning simple, enjoyable, and effective for young learners.
                            </p>

                        </div>

                        <div className="col-md-4">

                            <h5 className="quick-links-footer">Quick links</h5>

                            <ul className="list-unstyled">

                                <li><a href="/" className="text-white">Home</a></li>

                                <li><a href="/materials" className="text-white">Materials</a></li>

                                <li><a href="/about" className="text-white">About</a></li>

                                <li><a href="/support" className="text-white">Support</a></li>

                            </ul>

                            <div className="col">
                                <h5>Follow us on</h5>
                                <a href="#"
                                ><img
                                        src={facebook}
                                        alt="Facebook"
                                        width="30"
                                    /></a>
                                <a href="#"
                                ><img
                                        src={instagram}
                                        alt="Instagram"
                                        width="30"
                                    /></a>
                                <a href="#"
                                ><img src={twitter} alt="Twitter" width="30"
                                    /></a>
                            </div>

                        </div>

                        <div className="col-md-4">

                            <h5 className="contact-footer">Contact Us</h5>
                            <p className="fs-6 fs-md-5 fs-lg-4">Physical address</p>
                            <p className="fs-6 fs-md-5 fs-lg-4">+254712821844</p>
                            <p className="fs-6 fs-md-5 fs-lg-4">yawamrina99@gmail.com</p>
                            <p className="fs-6 fs-md-5 fs-lg-4">Postal address</p>

                        </div>

                    </div>

                </div>

                <div className="mt-3 copyright-sec mb-0">

                    <p className="my-2 px-2 fs-6 fs-md-5 fs-lg-4">© 2024 | Elimu Yetu. All Rights Reserved</p>

                </div>

            </footer>
        </>
    );
}

export default Footer;