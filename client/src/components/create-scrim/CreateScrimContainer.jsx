import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";
import {
  Box,
  Button,
  HStack,
  VStack,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { ERROR_TOAST, handleError, STEPS } from "../../utils";
import Pool from "./Pool";
import SelectCaptains from "./SelectCaptains";
import Prizewheel from "./Prizewheel";
import Draft from "./Draft";
import Bracket from "./Bracket";

const CreateScrimContainer = () => {
  const { id } = useParams();
  const [scrim, setScrim] = useState();
  const [nextDisabled, setNextDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toast = useToast(ERROR_TOAST);

  useEffect(() => {
    const loadScrim = async (scrimId) => {
      setLoading(true);
      let scrim;
      try {
        if (scrimId) {
          scrim = await API.getScrim(scrimId);
        } else {
          scrim = await API.createScrim();
          navigate("" +  scrim.id);
        }
        setScrim(scrim);
      } catch(err) {
        toast({ description: handleError(err).message });
      } finally {
        setLoading(false);
      }
    }
    loadScrim(id);
  }, [id]);

  const handleNext = async () => {
    if (!validate(scrim)) {
      return;
    }

    const currentStepOrder = STEPS.find(step => step.name === scrim.step).order;
    const nextStep = STEPS.find(step => step.order === currentStepOrder + 1).name;
    const nextScrim = { ...scrim, step: nextStep};
    setLoading(true);
    try {
      if (scrim.step === 'pool') {
        await API.deleteMembersForScrim(scrim.id);
        const result = await API.createMembers(scrim.summoners.map(summoner => summoner.id), scrim.id);
        nextScrim.pool = result.members;
      } else if (scrim.step === 'select-captains') {
        const result = await API.updateMembers(scrim.pool);
        nextScrim.pool = result.members;
      } else if (scrim.step === 'prize-wheel') {
        await API.deleteTeamsForScrim(scrim.id);
        const result = await API.createTeams(scrim.teams);
        nextScrim.teams = result.teams;
      } else if (scrim.step === 'draft') {
        const result = await API.updateTeams(scrim.teams);
        nextScrim.teams = result.teams;
      }

      setScrim(nextScrim);
      await API.updateScrim(nextScrim);
    } catch(err) {
      toast({ description: handleError(err).message });
    } finally {
      setLoading(false);
    }
  }

  const handlePrevious = async () => {
    const currentStepOrder = STEPS.find(step => step.name === scrim.step).order;
    const previousStep = STEPS.find(step => step.order === currentStepOrder - 1)?.name;
    if (previousStep) {
      const previousScrim = {...scrim, step: previousStep };

      setLoading(true);
      try {
        setScrim(previousScrim);
        await API.updateScrim(previousScrim);
        validate(previousScrim);
      } catch(err) {
        toast({ description: handleError(err).message });
      } finally {
        setLoading(false);
      }
    }
  }

  const validate = (scrim) => {
    let errorMessage;
    if (!scrim) {
      errorMessage = 'There was an error';
    } else if (scrim.step === 'pool') {
      setNextDisabled(scrim.summoners.length < scrim.numTeams * scrim.teamSize);
    } else if (scrim.step === 'select-captains') {
      setNextDisabled(scrim.pool.filter(m => m.isCaptain).length !== scrim.numTeams);
    } else if (scrim.step === 'prize-wheel') {
      setNextDisabled(!scrim.teams || scrim.teams.length !== scrim.numTeams);
    } else if (scrim.step === 'draft') {
      const draftedMembers = scrim.teams.reduce((a, team) => a + team.members.length, 0);
      const minDraft = scrim.numTeams * scrim.teamSize;
      setNextDisabled(draftedMembers < minDraft);
    }

    if (errorMessage) {
      toast({ message: errorMessage });
    }

    return !errorMessage;
  }

  return (
    <VStack pt={10} h='calc(100vh - 4rem)' justifyContent='space-between'>
      {scrim?.step === 'pool' && 
        <Pool pool={scrim.pool} teamSize={scrim.teamSize} numTeams={scrim.numTeams} onChange={(data) => {
          const { summoners, numTeams, teamSize } = data;
          const nextScrim = {...scrim, summoners, numTeams, teamSize };
          validate(nextScrim) && setScrim(nextScrim);
        }} />
      }
      {scrim?.step === 'select-captains' &&
        <SelectCaptains pool={scrim.pool} numTeams={scrim.numTeams} onChange={(pool) => {
          const nextScrim = {...scrim, pool };
          validate(nextScrim) && setScrim(nextScrim);
        }}/>
      }
      {scrim?.step === 'prize-wheel' &&
        <Prizewheel pool={scrim.pool} scrimId={scrim.id} onChange={(teams) => {
          const nextScrim = {...scrim, teams };
          validate(nextScrim) && setScrim(nextScrim);
        }} />
      }
      {scrim?.step === 'draft' &&
        <Draft pool={scrim.pool} teams={scrim.teams}  onChange={(data) => {
          const { team, pool } = data;
          const nextScrim = {...scrim, teams, pool};
          validate(nextScrim) && setScrim(nextScrim);
        }} />
      }
      {scrim?.step === 'bracket' &&
        <Bracket teams={scrim.teams} />
      }

      <HStack h={16} justifyContent={'space-between'} bg={useColorModeValue('gray.100', 'gray.900')} w='100%' px={4}>
        {scrim?.step !== 'pool' ? <Button isLoading={loading} onClick={handlePrevious}>Previous</Button> : <div></div> }
        {scrim?.step !== 'bracket' ? <Button isLoading={loading} isDisabled={nextDisabled} onClick={handleNext}>Next</Button> : <div></div> }
      </HStack>
    </VStack>
  )
}

export default CreateScrimContainer;