//  PACKAGES
import t from "./actionTypes";

const initialState = {
  issueUrl: "https://github.com/dappnode/DNP_ADMIN/issues/new",
  diagnoses: [],
  info: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case t.UPDATE_ISSUE_URL:
      return {
        ...state,
        issueUrl: action.issueUrl
      };
    case t.UPDATE_INFO:
      return {
        ...state,
        info: {
          ...state.info,
          [action.topic]: action.info
        }
      };
    case t.UPDATE_DIAGNOSE:
      return {
        ...state,
        diagnoses: [...state.diagnoses, action.diagnose]
      };
    case t.CLEAR_DIAGNOSE:
      return {
        ...state,
        diagnoses: []
      };
    default:
      return state;
  }
}
