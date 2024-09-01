import Image from "next/image";
import { MapPinIcon, GlobeIcon, UsersIcon, Languages, CircleDollarSign, Phone } from "lucide-react";
import { ReactNode } from "react";

interface Translation {
  official: string;
  common: string;
}

interface Idd {
  root: string;
  suffixes: string[];
}

interface CountryInfo {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  region: string;
  subregion: string;
  languages: { [key: string]: string };
  population: number;
  currencies: { [key: string]: { name: string; symbol: string } };
  flags: {
    svg: string;
    alt: string;
  };
  translations: { [key: string]: Translation };
  idd: Idd;
}

interface CountryInfoProps {
  country: CountryInfo;
}

export default function CountryInfo({ country }: CountryInfoProps) {
  return (
    <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="w-full flex flex-col gap-4 md:gap-0 md:flex-row">
          <div className="w-full md:w-[30%]">
            <h2 className="text-3xl font-bold mb-1">{country.name.common}</h2>
            <h3 className="text-md  font-medium mb-4">{country.name.official}</h3>
            <Image
              src={country.flags.svg}
              alt={country.flags.alt}
              width={200}
              height={133}
              className="rounded shadow-md"
            />
          </div>
          <div className="w-full md:w-[60%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={<MapPinIcon className="w-5 h-5 text-blue-600" />} label="Capital">
                {country.capital[0]}
              </InfoItem>
              <InfoItem icon={<GlobeIcon className="w-5 h-5 text-blue-600" />} label="Región">
                {`${country.subregion}, ${country.region}`}
              </InfoItem>
              <InfoItem icon={<Languages className="w-5 h-5 text-blue-600" />} label="Idioma">
                {Object.values(country.languages)[0]}
              </InfoItem>
              <InfoItem icon={<UsersIcon className="w-5 h-5 text-blue-600" />} label="Población">
                {country.population.toLocaleString()}
              </InfoItem>
              <InfoItem icon={<CircleDollarSign className="w-5 h-5 text-blue-600" />} label="Moneda">
                {`${Object.values(country.currencies)[0].name} (${Object.values(country.currencies)[0].symbol
                  })`}
              </InfoItem>
              <InfoItem icon={<Phone className="w-5 h-5 text-blue-600" />} label="Prefijo">
                {`${country.idd.root}${country.idd.suffixes.join(", ")}`}
              </InfoItem>
            </div>
          </div>
        </div>
        <div className="w-full mt-3 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, tempora beatae tenetur illo in, fugiat quaerat nostrum, expedita sequi dolore repellendus deleniti esse nisi minus asperiores nihil? Animi, laboriosam id.
        </div>
      </div>
    </div>
  );
}

interface InfoItem {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

function InfoItem({ icon, label, children }: InfoItem) {
  return (
    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
      {icon}
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{children}</p>
      </div>
    </div>
  );
}