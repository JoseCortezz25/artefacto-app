import Loader from "./loader";

const LoadingPage = () => {
  return (
    <section className="w-full">
      <div className=" mx-auto flex flex-col items-center justify-center h-[80dvh]">
        <div className="flex flex-col items-center justify-center max-w-[610px]">
          <div className="mb-6">
            <Loader />
          </div>
          <h2 className="text-[20px] leading-[24px] sm:text-[30px] sm:leading-[36px] text-center font-medium">
            Buscando en el rincón más profundo de la web para
            responderte...🚀
          </h2>
        </div>
      </div>
    </section>
  );
};

export default LoadingPage;