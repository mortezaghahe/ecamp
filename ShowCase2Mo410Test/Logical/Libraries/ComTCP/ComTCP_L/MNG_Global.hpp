
#ifndef  _MNGGLOBAL_HPP_
#define _MNGGLOBAL_HPP_

#include <mng_globalTYP.h>


    typedef struct {

		signed short NumSignals;

        /* BOOL diUnloaded */
        BOOL diUnloaded;
        /* BOOL diLiftUnload */
        BOOL diLiftUnload;
        /* BOOL diLiftTop */
        BOOL diLiftTop;
        /* BOOL diBoxLift */
        BOOL diBoxLift;
        /* BOOL diLiftBottom */
        BOOL diLiftBottom;
        /* BOOL diConvBottom */
        BOOL diConvBottom;
        /* BOOL diConvTop */
        BOOL diConvTop;

        } ComTCP_INPUTS_32BIT_FWRD;


    typedef struct {

		signed short NumSignals;

        /* REAL OutfeedConv_Velocity */
        REAL OutfeedConv_Velocity;
        /* BOOL doLiftTop */
        BOOL doLiftTop;
        /* BOOL doLiftBottom */
        BOOL doLiftBottom;
        /* BOOL doLiftUnload */
        BOOL doLiftUnload;
        /* BOOL doConvLift */
        BOOL doConvLift;
        /* REAL ConvLift_Velocity */
        REAL ConvLift_Velocity;
        /* BOOL doConvBottom */
        BOOL doConvBottom;
        /* REAL ConvBottom_Velocity */
        REAL ConvBottom_Velocity;
        /* LREAL BottomBox_ReleaseTime */
        REAL BottomBox_ReleaseTime;
        /* BOOL doConvTop */
        BOOL doConvTop;
        /* REAL ConvTop_Velocity */
        REAL ConvTop_Velocity;
        /* LREAL TopBox_ReleaseTime */
        REAL TopBox_ReleaseTime;
        /* REAL InfeedConvTop_Velocity */
        REAL InfeedConvTop_Velocity;
        /* REAL InfeedConvBottom_Velocity */
        REAL InfeedConvBottom_Velocity;

        } ComTCP_OUTPUTS_32BIT_FWRD;



#endif
