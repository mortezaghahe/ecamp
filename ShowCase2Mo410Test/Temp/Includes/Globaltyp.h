/* Automation Studio generated header file */
/* Do not edit ! */

#ifndef _BUR_1697136289_1_
#define _BUR_1697136289_1_

#include <bur/plctypes.h>

/* Datatypes and datatypes of function blocks */
typedef struct iPhysicParam_typ
{	float UserOutfeedConvVelocity;
	float UserInfeedConvTopVelocity;
	float UserInfeedConvBottomVelocity;
	float UserConvTopVelocity;
	float UserConvLiftVelocity;
	float UserConvBottomVelocity;
	float UserTopBoxReleaseTime;
	float UserBottomBoxReleaseTime;
	plctime BlockSensorLowerConvTime;
	plctime BlockSensorUpperConvTime;
	float MaximumUloadedBox;
} iPhysicParam_typ;

typedef struct Axis_type
{	plcbit Exists;
	plcstring name[11];
	plcbit cmdReset;
	plcbit cmdStart;
	plcbit cmdCam;
	plcbit cmdGear;
	plcbit cmdStop;
	plcbit cmdHome;
	plcbit cmdReference;
	plcbit cmdRun;
	plcbit cmdOffset;
	plcbit cmdJog;
	plcbit cmdManualForward;
	plcbit cmdManualReverse;
	plcbit cmdMoveAbsolute;
	float parmSpeed;
	float parmAccelDecel;
	float parmAbsolutePosition;
	float parmMaxTorque;
	plcbit statusOn;
	plcbit statusOff;
	plcbit statusDisabled;
	plcbit statusFaulted;
	plcbit statusStarting;
	plcbit statusHoming;
	plcbit statusInPosition;
	plcbit statusRunning;
	plcbit statusJogging;
	plcbit statusMoving;
	plcbit statusManualForward;
	plcbit statusManualReverse;
	plcbit statusStopping;
	plcbit statusHomed;
	double statusPosition;
	float statusSpeed;
	float statusCurrent;
	float statusLagError;
	float statusTemperature;
	float statusTorque;
	double statusMasterOffset;
	plcbit statusAbsMoveActive;
	plcbit statusGeared;
	plcbit statusPoweredOff;
	plcbit statusStopped;
	float statusPeakCurrent;
	float statusPeakLagError;
	float statusPeakTorque;
	unsigned long statusErrorID;
	float parmMaintMax;
	float parmMaintMin;
	float parmMax;
	float parmMin;
	float parmOperMax;
	float parmOperMin;
	float parmReferencePosition;
} Axis_type;






__asm__(".section \".plc\"");

/* Used IEC files */
__asm__(".ascii \"iecfile \\\"Logical/Global.typ\\\" scope \\\"global\\\"\\n\"");

/* Exported library functions and function blocks */

__asm__(".previous");


#endif /* _BUR_1697136289_1_ */

