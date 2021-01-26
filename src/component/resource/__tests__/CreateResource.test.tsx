import * as React from "react";
import Ajax from "../../../util/Ajax";
import {intlFunctions} from "../../../__tests__/environment/IntlUtil";
import Routing from "../../../util/Routing";
import Routes from "../../../util/Routes";
import {CreateResource} from "../CreateResource";
import {mountWithIntl} from "../../../__tests__/environment/Environment";
import {CreateResourceForm} from "../CreateResourceForm";

jest.mock("../../../util/Routing");
jest.mock("../../../util/Ajax", () => {
    const originalModule = jest.requireActual("../../../util/Ajax");
    return {
        ...originalModule,
        default: jest.fn()
    };
});

describe("CreateResource", () => {
    const iri = "http://onto.fel.cvut.cz/ontologies/termit/resource/test";

    beforeEach(() => {
        Ajax.post = jest.fn().mockImplementation(() => Promise.resolve({ data : iri }));
    });

    it("returns to Resource Management on cancel", () => {
        const wrapper = mountWithIntl(<CreateResource {...intlFunctions()}/>);
        wrapper.find("#create-resource-cancel").at(0).simulate("click");
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.resources);
    });

    it("returns to Resource Management on submit", () => {
        const wrapper = mountWithIntl(<CreateResource {...intlFunctions()}/>);
        (wrapper.find(CreateResourceForm).instance().props as any).onSuccess(iri);
        expect(Routing.transitionTo).toHaveBeenCalledWith(Routes.resourceSummary,  {
            params: new Map([["name", "test"]]),
            query: new Map()
        });
    });
});
