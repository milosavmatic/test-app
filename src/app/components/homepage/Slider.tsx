"use client"
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Aos from "aos";
import { Banner } from "@/app/page";

interface SliderProps {
  banners: Banner[];
}

const Slider = ({ banners }: SliderProps) => {
  const [currentSlide, setCurrentSlide] = useState<{
    index: number;
    banner: string;
  }>({
    index: 0,
    banner: banners[0]?.image,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setCurrentSlide({
          index: draggingIndex,
          banner: banners[draggingIndex]?.image,
        });
        setIsDragging(false);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        event.preventDefault();
        const sliderRect = sliderRef?.current?.getBoundingClientRect();
        const slideWidth = sliderRect ? sliderRect.width / banners.length : 0;
        const mouseX = event.clientX - (sliderRect?.left || 0);
        let newIndex = Math.floor(mouseX / slideWidth);
        if (newIndex < 0) newIndex = 0;
        if (newIndex > banners.length - 1) newIndex = banners.length - 1;
        setDraggingIndex(newIndex);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, draggingIndex, banners]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide({
      index: index,
      banner: banners[index]?.image,
    });
  };

  useEffect(() => {
    Aos.init();
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const nextSlide = () => {
      setCurrentSlide((prevState) => {
        const nextIndex = (prevState.index + 1) % banners.length;
        return {
          index: nextIndex,
          banner: banners[nextIndex]?.image,
        };
      });
    };
    intervalRef.current = setInterval(nextSlide, 5000);
    const handleInteraction = () => {
      clearInterval(intervalRef.current!);
      intervalRef.current = setInterval(nextSlide, 5000);
    };
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    return () => {
      clearInterval(intervalRef.current!);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, [banners]);

  return (
    <div
      data-aos="zoom-in"
      className=" block max-sm:h-[400px] md:h-[510px] lg:h-[690px] xl:h-[860px] 2xl:h-[1000px] 3xl:h-[1057px] w-full"
      ref={sliderRef}
    >
      <div className="relative h-full overflow-hidden">
        <div className=" items-center max-sm:h-[400px] justify-between h-full w-full">
          {banners.map((banner, index) => {
            const isActive = currentSlide?.index === index;

            return (
              <div
                key={index}
                className={
                  isActive
                    ? "relative overflow-hidden h-full opacity-100 duration-[400ms] transition-all ease-in"
                    : index < currentSlide?.index
                      ? "absolute h-full overflow-hidden opacity-0 duration-[400ms] transition-all ease-in"
                      : "absolute overflow-hidden h-full opacity-0 duration-[400ms] transition-all ease-in"
                }
              >
                {banner && <div className="relative max-sm:h-[400px] sm:h-full">
                  <Image
                    src={banner?.image}
                    alt={banner?.title ?? ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    priority
                  />
                  <div
                    className="absolute z-[49] top-0 left-0 w-full h-full bg-black transition-all duration-500 bg-opacity-40"
                  >
                    <div className="absolute flex flex-col items-center justify-center max-sm:gap-[20px] gap-[33px] max-sm:top-[50%] top-[40%] text-center left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      {banner?.title && (
                        <Link href={`${banner?.url ?? `/`}`} className="text-white max-sm:text-base text-xl font-bold ">
                          {banner?.title}
                        </Link>
                      )}
                      {banner?.subtitle && (
                        <Link href={`${banner?.url ?? `/`}`} className="text-white max-sm:text-xl text-4xl font-bold uppercase">
                          {banner?.subtitle}
                        </Link>
                      )}

                      {banner?.button && (
                        <Link href={`${banner?.url ?? `/stranica-u-izradi`}`} className="bg-transparent  hover:bg-white hover:text-black transition-all duration-300  text-white text-sm font-bold uppercase py-4 px-12 max-sm:px-2 max-sm:py-2 max-sm:flex max-sm:items-center max-sm:justify-center border border-white max-sm:w-[250px]">
                          {banner?.button}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative">
        <div className="absolute max-sm:-top-[1rem] md:-top-[2rem] xl:-top-[2rem] 2xl:-top-20  w-full flex items-center justify-center z-[50]">
          {banners.map((banner, index) => (
            <div
              data-testid={`slider-${index}`}
              key={index}
              className={`${currentSlide?.index === index ? "bganimate" : "bg-gray-500"
                } w-32 h-[3.5px]  mx-1 cursor-pointer`}
              onClick={() => handleSlideChange(index)}
            ></div>
          ))}

          {banners.map((banner, index) => (
            <div
              key={index}
              className="absolute flex gap-10 items-center bottom-6"
            >
              <i
                className="cursor-pointer fas fa-chevron-left text-white text-sm"
                onClick={
                  currentSlide?.index === 0
                    ? () => handleSlideChange(banners.length - 1)
                    : () => handleSlideChange(currentSlide?.index - 1)
                }
              ></i>
              <div>
                <h1 className="text-white">{`${currentSlide?.index + 1} / ${banners?.length
                  }`}</h1>
              </div>
              <i
                className="fas cursor-pointer fa-chevron-right text-white text-sm"
                onClick={
                  currentSlide?.index === banners.length - 1
                    ? () => handleSlideChange(0)
                    : () => handleSlideChange(currentSlide?.index + 1)
                }
              ></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;