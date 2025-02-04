import { NextResponse } from "next/server";
// import careerPaths from "@/components/careerPaths.json";
// import OpenAI from "openai";
// const openai = new OpenAI();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const getData = await req.json();
        const userData = getData.formData

        if (!userData) {
            return NextResponse.json(
                { error: "User Data is required" },
                { status: 400 }
            );
        }
        const prompt = `
        Given the following user profile, recommend 3 suitable career paths:
        Skills: ${userData.skills.join(", ")}
        Interests: ${userData.interests.join(", ")}
        Personality Traits: Analytical (${userData.analytical}), Creative (${userData.creative})
        Preferred Work Environment: ${userData.preferredWorkEnvironment}
        Time Commitment: ${userData.timeCommitment} hours per week

        Consider the skills, personality, interests, and time commitment. Also, take into account emerging industry trends and market demand.

        Output the career suggestions with a short explanation for each suggestion.
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);

        if (!result) {
            return NextResponse.json(
                { error: "result not generated" },
                { status: 400 }
            )
        }

        const careerSuggestions = result.response.text()

        return NextResponse.json(
            { message: "Career recommendations generated successfully", recommendation: careerSuggestions },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json(
            { error: "AI Response not generated" },
            { status: 500 }
        );
    }
}


// export async function POST(req) {
//     try {
//         const userData = await req.json();

//         if (!userData) {
//             return NextResponse.json(
//                 { error: "User Data is required" },
//                 { status: 400 }
//             );
//         }
//         const prompt = `
//         Given the following user profile, recommend 3 suitable career paths:
//         Skills: ${userData.skills.join(", ")}
//         Interests: ${userData.interests.join(", ")}
//         Personality Traits: Analytical (${userData.personalityTraits.analytical}), Creative (${userData.personalityTraits.creative})
//         Preferred Work Environment: ${userData.preferredWorkEnvironment}
//         Time Commitment: ${userData.timeCommitment} hours per week

//         Consider the skills, personality, interests, and time commitment. Also, take into account emerging industry trends and market demand.

//         Output the career suggestions with a short explanation for each suggestion.
//         `;

//         const completion = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: prompt,
//             response_format: { type: 'json_object' }
//         });

//         console.log("completion: ", completion);

//         const careerSuggestions = completion.choices[0].message.content

//         const recommendCareer = careerSuggestions.split("\n").map((line) => {
//             return {
//                 suggestion: line.trim(),
//             };
//         });


//         return NextResponse.json(
//             { message: "Career recommendations generated successfully", recommendation: recommendCareer },
//             { status: 200 }
//         )

//     } catch (error) {
//         console.log("Error:", error);
//         return NextResponse.json(
//             { error: "AI Response not generated" },
//             { status: 500 }
//         );
//     }
// }



// export async function POST(req) {
//     try {
//         const userData = await req.json();

//         if (!userData) {
//             return NextResponse.json(
//                 { error: "User Data is required" },
//                 { status: 400 }
//             );
//         }

//         const { skills, interests, personalityTraits } = userData.formData

//         const recommendCareer = careerPaths.map((career) => {
//             let matchScore = 0;

//             matchScore += skills.filter(skill => career.skills.includes(skill).length * 2)
//             matchScore += interests.filter(interest => career.interests.includes(interest).length * 1.5)

//             if (personalityTraits) {
//                 matchScore += (career.personalityTraits.analytical * (personalityTraits.analytical || 0))
//                 matchScore += (career.personalityTraits.creative * (personalityTraits.creative || 0))
//             }

//             return { ...career, matchScore }
//         }).sort((a, b) => b.matchScore - a.matchScore)
//             .slice(0, 3)

//         return NextResponse.json(
//             { message: "Career recommendations generated successfully", recommendation: recommendCareer },
//             { status: 200 }
//         )

//     } catch (error) {
//         console.log("Error:", error);
//         return NextResponse.json(
//             { error: "AI Response not generated" },
//             { status: 500 }
//         );
//     }
// }