import {NextResponse} from "next/server";
const SESSION_VALUE="arena-sul-7e4c8d21b9534f06a812";
export async function POST(request:Request){const{user,password}=await request.json() as {user?:string;password?:string};if(user!=="ARENASUL2026"||password!=="ARENASUL20262026")return NextResponse.json({ok:false},{status:401});const response=NextResponse.json({ok:true});response.cookies.set("arena_session",SESSION_VALUE,{httpOnly:true,secure:true,sameSite:"strict",path:"/",maxAge:60*60*24*30});return response}
