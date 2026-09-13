import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // ==========================================
    // CHECK RESEND API KEY
    // ==========================================

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing");

      return NextResponse.json(
        {
          success: false,
          message: "Resend API key is not configured.",
        },
        { status: 500 }
      );
    }

    // ==========================================
    // GET REQUEST DATA
    // ==========================================

    const data = await request.json();

    const {
      requestId,
      name,
      email,
      phone,
      productName,
      companyName,
    } = data;

    // ==========================================
    // VALIDATE REQUIRED FIELDS
    // ==========================================

    if (!requestId || !name || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Required seller details are missing.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // OWNER EMAIL
    // ==========================================

    const ownerEmail = process.env.SELLER_REGISTRATION_EMAIL;

    if (!ownerEmail) {
      console.error("SELLER_REGISTRATION_EMAIL is missing");

      return NextResponse.json(
        {
          success: false,
          message:
            "SELLER_REGISTRATION_EMAIL is not configured.",
        },
        { status: 500 }
      );
    }

    const {
      data: ownerEmailData,
      error: ownerEmailError,
    } = await resend.emails.send({
      from: "Seller Registration (Skyma) <noreply-skyma@resend.dev>",

      to: [ownerEmail],

      subject: `New Seller Registration - ${requestId}`,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 750px;
            margin: 0 auto;
            color: #333333;
          "
        >

          <h2 style="color: #03471c;">
            New Seller Registration
          </h2>

          <p>
            A new seller registration request has been submitted through Skyma.
          </p>

          <h3 style="color: #03471c; margin-top: 30px;">
            Request Information
          </h3>

          <table
            style="
              width: 100%;
              border-collapse: collapse;
            "
          >

            <tr>
              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  font-weight: bold;
                "
              >
                Request ID
              </td>

              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                "
              >
                ${requestId}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  font-weight: bold;
                "
              >
                Registration Type
              </td>

              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                "
              >
                Export
              </td>
            </tr>

          </table>

          <h3 style="color: #03471c; margin-top: 30px;">
            Seller Details
          </h3>

          <table
            style="
              width: 100%;
              border-collapse: collapse;
            "
          >

            <tr>
              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  font-weight: bold;
                "
              >
                Name
              </td>

              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                "
              >
                ${name}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  font-weight: bold;
                "
              >
                Email
              </td>

              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                "
              >
                ${email}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  font-weight: bold;
                "
              >
                Phone
              </td>

              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                "
              >
                ${phone || "-"}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  font-weight: bold;
                "
              >
                Company Name
              </td>

              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                "
              >
                ${companyName || "-"}
              </td>
            </tr>

          </table>

          <h3 style="color: #03471c; margin-top: 30px;">
            Product Details
          </h3>

          <table
            style="
              width: 100%;
              border-collapse: collapse;
            "
          >

            <tr>
              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  font-weight: bold;
                "
              >
                Product Name
              </td>

              <td
                style="
                  padding: 10px;
                  border: 1px solid #ddd;
                "
              >
                ${productName || "-"}
              </td>
            </tr>

          </table>

          <p
            style="
              margin-top: 30px;
              color: #666666;
            "
          >
            Please review this seller export request in the Skyma system.
          </p>

        </div>
      `,
    });

    // ==========================================
    // SELLER CONFIRMATION EMAIL
    // ==========================================

    const {
      data: sellerEmailData,
      error: sellerEmailError,
    } = await resend.emails.send({
      from: "Do Not Reply <noreply-skyma@resend.dev>",

      to: ["skyma.info@gmail.com"],

      subject: `Seller Registration Successful - ${requestId}`,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 700px;
            margin: 0 auto;
            padding: 30px;
            color: #333333;
          "
        >

          <h2
            style="
              color: #03471c;
              margin-bottom: 24px;
            "
          >
            Seller Registration Successful
          </h2>

          <p>
            Dear ${name},
          </p>

          <p>
            Thank you for submitting your export request with Skyma.
          </p>

          <p>
            Your seller registration request has been successfully submitted
            to our team.
          </p>

          <div
            style="
              background-color: #f0f9f3;
              border: 1px solid #cce8d5;
              border-radius: 10px;
              padding: 20px;
              margin: 25px 0;
            "
          >

            <p style="margin: 0 0 12px 0;">
              <strong>Request ID:</strong>
              ${requestId}
            </p>

            <p style="margin: 0 0 12px 0;">
              <strong>Product Name:</strong>
              ${productName || "-"}
            </p>

            <p style="margin: 0;">
              <strong>Status:</strong>
              In-progress
            </p>

          </div>

          <p>
            Our team will review your seller registration,
            product information, company details, and other
            information provided in your request.
          </p>

          <p>
            We will contact you using the details provided
            in your registration if any further information
            is required.
          </p>

          <p>
            Please keep your Request ID
            <strong>${requestId}</strong>
            for future communication regarding your export request.
          </p>

          <p>
            Thank you for choosing Skyma.
          </p>

          <div
            style="
              margin-top: 35px;
              padding-top: 15px;
              border-top: 1px solid #dddddd;
              font-size: 12px;
              color: #777777;
            "
          >

            <strong>DO NOT REPLY TO THIS EMAIL.</strong>

            <br />

            This is an automated email sent by Skyma.
            Please do not reply to this message.

          </div>

        </div>
      `,
    });

    // ==========================================
    // CHECK OWNER EMAIL ERROR
    // ==========================================

    if (ownerEmailError) {
      console.error(
        "Owner seller email failed:",
        ownerEmailError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Owner email failed.",
          error: ownerEmailError,
        },
        { status: 500 }
      );
    }

    // ==========================================
    // CHECK SELLER EMAIL ERROR
    // ==========================================

    if (sellerEmailError) {
      console.error(
        "Seller confirmation email failed:",
        sellerEmailError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Seller confirmation email failed.",
          error: sellerEmailError,
        },
        { status: 500 }
      );
    }

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json({
      success: true,
      message: "Seller registration emails sent successfully.",
      ownerEmailId: ownerEmailData?.id,
      sellerEmailId: sellerEmailData?.id,
    });

  } catch (error) {
    console.error(
      "Seller registration email error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send seller registration email.",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}