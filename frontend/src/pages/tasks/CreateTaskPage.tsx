import React from 'react'
import useSetPageTitleHook from '../../shared/hooks/useSetPageTitleHook';

export default function CreateTaskPage() {
   useSetPageTitleHook({ title: "Tasks " });
  return (
    <div>CreateTaskPage</div>
  )
}
