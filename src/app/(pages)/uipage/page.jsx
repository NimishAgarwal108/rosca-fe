import Footer from "../../../components/custom/footer";
import Header from "../../../components/custom/header";
import Main from "../../../components/custom/Main";
export default function page() {
  return (
    <div className="mt-20">
      <Header />
      <Main />

      <Footer id="footer" />
    </div>
  );
}
