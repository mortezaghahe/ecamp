/* Automation Studio generated header file */
/* Do not edit ! */

#ifndef _BUR_1697136289_6_
#define _BUR_1697136289_6_

#include <bur/plctypes.h>

/* Datatypes and datatypes of function blocks */
typedef struct ComTCP_INPUTS_32BIT
{	signed short NumSignals;
	plcbit diUnloaded;
	plcbit diLiftUnload;
	plcbit diLiftTop;
	plcbit diBoxLift;
	plcbit diLiftBottom;
	plcbit diConvBottom;
	plcbit diConvTop;
} ComTCP_INPUTS_32BIT;

typedef struct ComTCP_OUTPUTS_32BIT
{	signed short NumSignals;
	float OutfeedConv_Velocity;
	plcbit doLiftTop;
	plcbit doLiftBottom;
	plcbit doLiftUnload;
	plcbit doConvLift;
	float ConvLift_Velocity;
	plcbit doConvBottom;
	float ConvBottom_Velocity;
	float BottomBox_ReleaseTime;
	plcbit doConvTop;
	float ConvTop_Velocity;
	float TopBox_ReleaseTime;
	float InfeedConvTop_Velocity;
	float InfeedConvBottom_Velocity;
} ComTCP_OUTPUTS_32BIT;






__asm__(".section \".plc\"");

/* Used IEC files */
__asm__(".ascii \"iecfile \\\"Logical/Libraries/ComTCP/MNG_Package.typ\\\" scope \\\"restricted\\\"\\n\"");

/* Exported library functions and function blocks */

__asm__(".previous");


#endif /* _BUR_1697136289_6_ */

