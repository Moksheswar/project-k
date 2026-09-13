import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Check API key
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

    const data = await request.json();

    const {
      requestId,
      name,
      email,
      phone,
      productName,
      productCategory,
      quantity,
      currency,
      priceRange,
      priceUnit,
      deliveryState,
      deliveryCity,
      deliveryPin,
      deliveryPort,
      sampleRequirement,
      supplyFrequency,
    } = data;

    // Validate required fields
    if (
      !requestId ||
      !name ||
      !email ||
      !phone ||
      !productName ||
      !productCategory
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Required buyer details are missing.",
        },
        { status: 400 }
      );
    }

    /*
     * ==========================================
     * OWNER EMAIL
     * ==========================================
     */

    const ownerEmail = process.env.SELLER_REGISTRATION_EMAIL;

    if (!ownerEmail) {
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
      from:
        "Buyer Registration (Skyma) <noreply-skyma@resend.dev>",

      to: [ownerEmail],

      subject: `Buyer Registration - ${requestId}`,

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
            New Buyer Registration
          </h2>

          <p>
            A new buyer import request has been submitted through Skyma.
          </p>

          <h3 style="color: #03471c;">
            Request Information
          </h3>

          <table
            style="
              width: 100%;
              border-collapse: collapse;
            "
          >

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Request ID
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${requestId}
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
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Product Category
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${productCategory || "-"}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Product Name
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${productName || "-"}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Quantity
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${quantity || "-"}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Currency
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${currency || "-"}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Price Range
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${priceRange || "-"}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Price Unit
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${priceUnit || "-"}
              </td>
            </tr>

          </table>

          <h3 style="color: #03471c; margin-top: 30px;">
            Delivery Details
          </h3>

          <table
            style="
              width: 100%;
              border-collapse: collapse;
            "
          >

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Delivery State
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${deliveryState || "-"}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Delivery City
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${deliveryCity || "-"}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                PIN Code
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${deliveryPin || "-"}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Delivery Port
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${deliveryPort || "-"}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Sample Requirement
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${sampleRequirement || "-"}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Supply Frequency
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${supplyFrequency || "-"}
              </td>
            </tr>

          </table>

          <h3 style="color: #03471c; margin-top: 30px;">
            Contact Details
          </h3>

          <table
            style="
              width: 100%;
              border-collapse: collapse;
            "
          >

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Name
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${name}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Email
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${email}
              </td>
            </tr>

            <tr>
              <td style="
                padding: 10px;
                border: 1px solid #ddd;
                font-weight: bold;
              ">
                Phone
              </td>

              <td style="
                padding: 10px;
                border: 1px solid #ddd;
              ">
                ${phone}
              </td>
            </tr>

          </table>

          <p style="
            margin-top: 30px;
            color: #666666;
          ">
            Please review this buyer import request in the Skyma system.
          </p>

        </div>
      `,
    });

    /*
     * ==========================================
     * BUYER CONFIRMATION EMAIL
     * ==========================================
     */

    const {
      data: buyerEmailData,
      error: buyerEmailError,
    } = await resend.emails.send({
      from:
        "Do Not Reply <noreply-skyma@resend.dev>",

      // For testing
      to: ["skyma.info@gmail.com"],

      subject: `Buyer Registration Successful - ${requestId}`,

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

          <h2 style="
            color: #03471c;
            margin-bottom: 24px;
          ">
            Buyer Registration Successful
          </h2>

          <p>
            Dear ${name},
          </p>

          <p>
            Thank you for submitting your import request with Skyma.
          </p>

          <p>
            Your buyer request has been successfully submitted to our team.
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

            <p style="margin: 0;">
              <strong>Product Name:</strong>
              ${productName}
            </p>

          </div>

          <p>
            Our team will review your import requirements,
            product specifications, quantity, pricing,
            delivery details, and other information provided
            in your request.
          </p>

          <p>
            We will contact you using the details provided
            in your registration if any further information
            is required.
          </p>

          <p>
            Please keep your Request ID
            <strong>${requestId}</strong>
            for future communication regarding your import request.
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

    /*
     * ==========================================
     * CHECK RESEND ERRORS
     * ==========================================
     */

    if (ownerEmailError) {
      console.error(
        "Owner buyer email failed:",
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

    if (buyerEmailError) {
      console.error(
        "Buyer confirmation email failed:",
        buyerEmailError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Buyer confirmation email failed.",
          error: buyerEmailError,
        },
        { status: 500 }
      );
    }

    /*
     * ==========================================
     * SUCCESS
     * ==========================================
     */

    return NextResponse.json({
      success: true,
      message: "Buyer registration emails sent successfully.",
      ownerEmailId: ownerEmailData?.id,
      buyerEmailId: buyerEmailData?.id,
    });

  } catch (error) {
    console.error(
      "Buyer registration email error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send buyer registration email.",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}