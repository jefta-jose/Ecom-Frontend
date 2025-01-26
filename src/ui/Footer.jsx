import Container from "./Container";
import { payment } from "../assets";
import FooterTop from "./FooterTop";
import { getUserRole } from "../lib/localStore";

const Footer = () => {

  const userRole = getUserRole();
  
  return (
    <div className={ userRole === "admin" ? "hidden" : "mt-10"}>
      <FooterTop />
      <Container className="flex flex-col md:flex-row items-center gap-4 justify-between">
        <p className=" text-center">@2024 E-commerce solutions.
          <br />
           All rights reserved.</p>
        <p>
          Built By{" "}
          <a target="blank" href="https://jeffndegwa.netlify.app/" className="text-blue-500 hover:underline font-semibold">
            Jeff Ndegwa
          </a>
        </p>
        <img src={payment} alt="payment-img" className="object-cover" />
      </Container>
    </div>
  );
};

export default Footer;
