/* Automation Studio generated header file */
/* Do not edit ! */

#ifndef _BUR_1697209046_1_
#define _BUR_1697209046_1_

#include <bur/plctypes.h>

/* Constants */
#ifdef _REPLACE_CONST
#else
#endif


/* Variables */
_GLOBAL float gSpeedFactor;
_GLOBAL plcbit gServoInitialized;
_GLOBAL unsigned short userRatioNumerator;
_GLOBAL unsigned short userRatioDenominator;
_GLOBAL struct MpAxisCouplingParType gCouplingPar3;
_GLOBAL struct MpAxisBasicParType gMpAxisBasicParType_Axis3;
_GLOBAL struct MpAxisBasicParType gMpAxisBasicParType_AxisVirtu3;
_GLOBAL struct MpAxisBasicParType gMpAxisBasicParType_Axis4;
_GLOBAL struct MpAxisCoupling gMpAxisCoupling_3;
_GLOBAL struct MpAxisBasic gMpAxisBasic_AxisVirtu3;
_GLOBAL struct MpAxisBasic gMpAxisBasic_Axis3;
_GLOBAL struct MpAxisBasic gMpAxisBasic_Axis4;
_GLOBAL struct MpAxisCouplingParType gCouplingPar;
_GLOBAL struct MpAxisBasicParType gMpAxisBasicParType_Axis1;
_GLOBAL struct MpAxisBasicParType gMpAxisBasicParType_AxisVirtu;
_GLOBAL struct MpAxisBasicParType gMpAxisBasicParType_Axis2;
_GLOBAL struct MpAxisCoupling gMpAxisCoupling_0;
_GLOBAL struct MpAxisBasic gMpAxisBasic_AxisVirtu;
_GLOBAL struct MpAxisBasic gMpAxisBasic_Axis1;
_GLOBAL struct MpAxisBasic gMpAxisBasic_Axis2;
_GLOBAL float gAxisPosition[2];
_GLOBAL struct Axis_type Axis1;
_GLOBAL struct Axis_type Axis3;
_GLOBAL_RETAIN struct CTU gBoxCountUnload;
_GLOBAL_RETAIN plcdt gErrorTime[10];
_GLOBAL_RETAIN plcstring gErrorDes[10][81];
_GLOBAL plcbit gReceiptChanged;
_GLOBAL plcbit gUserStop;
_GLOBAL plcbit gUserStart;
_GLOBAL plcbit gUserReset;
_GLOBAL_RETAIN signed short gSpeedRefHmi;
_GLOBAL_RETAIN struct iPhysicParam_typ gSiPhysics[3];
_GLOBAL plcbit gSaveParameter;
_GLOBAL plcbit gDisplayBlink;
_GLOBAL plcbit gDispalyStop;
_GLOBAL plcbit gDispalyRun;
_GLOBAL plcbit gDispalyNoComm;
_GLOBAL plcbit gDispalyAlarm;
_GLOBAL plcbit gComTCPSimActive;
_GLOBAL plcbit gActivateMotion;





__asm__(".section \".plc\"");

/* Used IEC files */
__asm__(".ascii \"iecfile \\\"Logical/Global.var\\\" scope \\\"global\\\"\\n\"");
__asm__(".ascii \"iecfile \\\"Logical/Libraries/MpAxis/MpAxis.fun\\\" scope \\\"global\\\"\\n\"");
__asm__(".ascii \"iecfile \\\"Logical/Libraries/standard/standard.fun\\\" scope \\\"global\\\"\\n\"");

/* Exported library functions and function blocks */

__asm__(".previous");


#endif /* _BUR_1697209046_1_ */

