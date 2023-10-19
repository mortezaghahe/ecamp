
#include "MNG_InternalTyp.hpp"

unsigned long int MNG_CpyOutToMsg(MNG_RawDatagram * pToServer, unsigned long int counter, ComTCP_OUTPUTS_32BIT_FWRD *pSimOutputs ) {

    
        unsigned long int DWordBuffer;
	
        pSimOutputs->NumSignals = 14;
        (pToServer->Header).ByteCount    = H_TO_NUDINT(60);
        (pToServer->Header).DatagramType = H_TO_NUDINT(MNG_Raw32BitImage);
        (pToServer->Header).SentTime = H_TO_NUDINT(0);  // Todo
        (pToServer->Header).Counter = H_TO_NUDINT(counter);
        pToServer->Payload[0] = H_TO_NUDINT(pSimOutputs->NumSignals);

    
    /* OutfeedConv_Velocity : FLOAT32 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->OutfeedConv_Velocity), 4);
    pToServer->Payload[1] = H_TO_NUDINT(DWordBuffer);


    /* doLiftTop : BOOL */
    if(pSimOutputs->doLiftTop == 1) {
        pToServer->Payload[2] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[2] = 0;
    }


    /* doLiftBottom : BOOL */
    if(pSimOutputs->doLiftBottom == 1) {
        pToServer->Payload[3] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[3] = 0;
    }


    /* doLiftUnload : BOOL */
    if(pSimOutputs->doLiftUnload == 1) {
        pToServer->Payload[4] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[4] = 0;
    }


    /* doConvLift : BOOL */
    if(pSimOutputs->doConvLift == 1) {
        pToServer->Payload[5] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[5] = 0;
    }


    /* ConvLift_Velocity : FLOAT32 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->ConvLift_Velocity), 4);
    pToServer->Payload[6] = H_TO_NUDINT(DWordBuffer);


    /* doConvBottom : BOOL */
    if(pSimOutputs->doConvBottom == 1) {
        pToServer->Payload[7] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[7] = 0;
    }


    /* ConvBottom_Velocity : FLOAT32 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->ConvBottom_Velocity), 4);
    pToServer->Payload[8] = H_TO_NUDINT(DWordBuffer);


    /* BottomBox_ReleaseTime : FLOAT64 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->BottomBox_ReleaseTime), 4);
    pToServer->Payload[9] = H_TO_NUDINT(DWordBuffer);


    /* doConvTop : BOOL */
    if(pSimOutputs->doConvTop == 1) {
        pToServer->Payload[10] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[10] = 0;
    }


    /* ConvTop_Velocity : FLOAT32 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->ConvTop_Velocity), 4);
    pToServer->Payload[11] = H_TO_NUDINT(DWordBuffer);


    /* TopBox_ReleaseTime : FLOAT64 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->TopBox_ReleaseTime), 4);
    pToServer->Payload[12] = H_TO_NUDINT(DWordBuffer);


    /* InfeedConvTop_Velocity : FLOAT32 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->InfeedConvTop_Velocity), 4);
    pToServer->Payload[13] = H_TO_NUDINT(DWordBuffer);


    /* InfeedConvBottom_Velocity : FLOAT32 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->InfeedConvBottom_Velocity), 4);
    pToServer->Payload[14] = H_TO_NUDINT(DWordBuffer);


	return 0;
}
