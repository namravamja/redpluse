"use client";
import { useGetUserDataQuery } from "@/app/lib/Donor";
import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Certificate interface
interface Certificate {
  eventName: string;
  dateIssued: string;
  issuedBy: string;
  quantity: number;
  bloodGroup: string;
}

export default function CertificatesPage() {
  const { data, error, isLoading } = useGetUserDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCertificateClick = (cert: Certificate) => {
    setSelectedCert(cert);
    setShowPopup(true);
  };

  const handleDownloadPDF = async () => {
    setShowPopup(false);

    setTimeout(async () => {
      const certificateElement = document.getElementById("certificate-for-pdf");
      if (!certificateElement) return;

      try {
        certificateElement.style.display = "block";
        certificateElement.style.position = "fixed";
        certificateElement.style.top = "-9999px";
        certificateElement.style.left = "-9999px";

        const canvas = await html2canvas(certificateElement, {
          scale: 2,
          logging: false,
          useCORS: true,
        });

        const pdfWidth = 1596 * 0.2645833333;
        const pdfHeight = 1200 * 0.2645833333;
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
          unit: "mm",
          format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          0,
          pdfWidth,
          pdfHeight
        );

        pdf.save(`${selectedCert?.eventName}_certificate.pdf`);
        certificateElement.style.display = "none";
      } catch (err) {
        console.error("Error generating PDF:", err);
        alert("Failed to generate PDF. Please try again.");
      }
    }, 100);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data) return <div>No user data available</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Certifications</h1>
      <p className="text-gray-600">
        These are the certificates you received from different blood banks and
        camps!
      </p>

      {data.certificates && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center gap-y-6">
          {data.certificates.map((cert: Certificate, index: number) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => handleCertificateClick(cert)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-300 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative flex flex-col bg-white border-2 border-blue-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 text-center">
                  <h2 className="text-xl font-bold">
                    Blood Donation Certificate
                  </h2>
                </div>

                <div className="p-6 flex flex-col items-center">
                  <h4 className="text-lg font-semibold my-2 text-gray-800">
                    {cert.eventName}
                  </h4>
                  <p className="text-gray-600">{formatDate(cert.dateIssued)}</p>
                  <div className="mt-4 text-red-600 hover:text-red-800">
                    Click to download certificate
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.certificates.length === 0 && (
        <p className="mt-8 text-center">No certificates found.</p>
      )}

      {showPopup && selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Download Certificate</h3>
            <p className="mb-6">
              Would you like to download the certificate for{" "}
              {selectedCert.eventName} as a PDF?
            </p>

            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
                onClick={() => setShowPopup(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                onClick={handleDownloadPDF}
              >
                Yes, Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Certificate Design */}
      <div id="certificate-for-pdf" className="hidden" ref={certificateRef}>
        {selectedCert && (
          <div
            style={{
              width: "1596px",
              height: "1200px",
              backgroundColor: "white",
              position: "relative",
              overflow: "hidden",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {/* Decorations */}
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "300px",
                height: "600px",
                background: "#9C1315",
                borderBottomRightRadius: "100px",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "180px",
                height: "600px",
                background: "#9C1315",
                borderBottomRightRadius: "50px",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                width: "80px",
                height: "1000px",
                background: "#9C1315",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                width: "250px",
                height: "500px",
                background: "#D42026",
                borderTopLeftRadius: "100px",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                width: "150px",
                height: "500px",
                background: "#9C1315",
                borderTopLeftRadius: "50px",
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                top: "150px",
                left: "150px",
                right: "150px",
                bottom: "150px",
                background: "white",
                zIndex: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "50px",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "20px",
                }}
              >
                <div style={{ textAlign: "left", width: "25%" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#666",
                    }}
                  >
                    {new Date(selectedCert.dateIssued).getFullYear()}
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#444",
                    }}
                  >
                    AWARD
                  </div>
                </div>
                <div style={{ textAlign: "center", width: "50%" }}>
                  <h1
                    style={{
                      fontSize: "64px",
                      fontWeight: "bold",
                      margin: "0 0 10px 0",
                      color: "#333",
                      textTransform: "uppercase",
                    }}
                  >
                    CERTIFICATE
                  </h1>
                  <p
                    style={{
                      fontSize: "28px",
                      color: "#666",
                      letterSpacing: "4px",
                      textTransform: "uppercase",
                      margin: "0",
                    }}
                  >
                    OF APPRECIATION
                  </p>
                </div>
                <div style={{ textAlign: "right", width: "25%" }}>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#666",
                    }}
                  >
                    Given By: {selectedCert.issuedBy}
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#444",
                    }}
                  >
                    Event Organizer
                  </div>
                </div>
              </div>

              {/* Name */}
              <div
                style={{ textAlign: "center", margin: "60px 0", width: "100%" }}
              >
                <p
                  style={{
                    fontSize: "32px",
                    fontWeight: "500",
                    color: "#333",
                    margin: "0 0 60px 0",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                  }}
                >
                  PROUDLY PRESENTED TO
                </p>
                <h2
                  style={{
                    fontSize: "72px",
                    fontFamily: "cursive, serif",
                    margin: "0 auto 10px",
                    fontWeight: "normal",
                    color: "#222",
                    borderBottom: "2px solid #ccc",
                    display: "inline-block",
                    padding: "0 100px 20px",
                    width: "auto",
                    textAlign: "center",
                  }}
                >
                  {data.fullName || "Donor Name"}
                </h2>
              </div>

              {/* Body */}
              <div
                style={{
                  textAlign: "center",
                  maxWidth: "80%",
                  margin: "0 auto",
                }}
              >
                <p
                  style={{ fontSize: "24px", lineHeight: "1.6", color: "#555" }}
                >
                  For your generous donation of{" "}
                  <span style={{ fontWeight: "bold", color: "#D42026" }}>
                    {selectedCert.quantity} ml
                  </span>{" "}
                  of{" "}
                  <span style={{ fontWeight: "bold", color: "#D42026" }}>
                    {selectedCert.bloodGroup}
                  </span>{" "}
                  blood during{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {selectedCert.eventName}
                  </span>
                  . Your contribution helps save lives and brings hope to those
                  in need.
                </p>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                  marginTop: "80px",
                }}
              >
                <div style={{ textAlign: "center", width: "35%" }}>
                  <div
                    style={{ borderTop: "2px solid #777", paddingTop: "15px" }}
                  >
                    <p style={{ margin: "0", fontSize: "24px" }}>Date</p>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "24px",
                        marginTop: "10px",
                      }}
                    >
                      {formatDate(selectedCert.dateIssued)}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "center", width: "35%" }}>
                  <div
                    style={{ borderTop: "2px solid #777", paddingTop: "15px" }}
                  >
                    <p style={{ margin: "0", fontSize: "24px" }}>Signature</p>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "24px",
                        marginTop: "10px",
                      }}
                    >
                      Event Director
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
