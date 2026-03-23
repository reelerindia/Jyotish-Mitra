export const PRODUCT_CONFIG = {
  mini: {
    amount: 19900,
    productName: "Mini Horoscope",
    pdfEndpoint: "mini_horoscope_pdf",
    languages: ["en","hi","bn","mr","ta","te","kn","ml"]
  },
  basic: {
    amount: 49900,
    productName: "Basic Horoscope",
    pdfEndpoint: "basic_horoscope_pdf",
    languages: ["en","hi","bn","mr","ta","te","kn","ml"]
  },
  professional: {
    amount: 99900,
    productName: "Professional Horoscope",
    pdfEndpoint: "pro_horoscope_pdf",
    languages: ["en","hi"]
  },
  matchmaking: {
    amount: 79900,
    productName: "Match Making Horoscope",
    pdfEndpoint: "match_making_pdf",
    languages: ["en","hi"]
  }
};

export function getBranding() {
  return {
    footer_link: process.env.BRAND_FOOTER_LINK || "",
    logo_url: process.env.BRAND_LOGO_URL || "",
    company_name: process.env.BRAND_COMPANY_NAME || "Jyotish Mitra",
    company_info: process.env.BRAND_COMPANY_INFO || "Premium astrology reports",
    domain_url: process.env.BRAND_DOMAIN_URL || "",
    company_email: process.env.BRAND_COMPANY_EMAIL || "",
    company_landline: process.env.BRAND_COMPANY_LANDLINE || "",
    company_mobile: process.env.BRAND_COMPANY_MOBILE || ""
  };
}
