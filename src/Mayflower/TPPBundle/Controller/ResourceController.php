<?php

namespace Mayflower\TPPBundle\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Mayflower\TPPBundle\Entity\Resource;
use Mayflower\TPPBundle\Form\ResourceType;

/**
 * Resource controller.
 *
 */
class ResourceController extends Controller
{

    /**
     * Lists all Resource entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $resources = $em->getRepository('MayflowerTPPBundle:Resource')->findAll();

        $resource_arr = [];
        foreach ($resources as $resource) {
            $resource_arr[] = $resource->toArray();
        }

        return new JsonResponse($resource_arr);
    }

    /**
     * Creates a new Resource entity.
     *
     */
    public function createAction(Request $request)
    {
        $resource = new Resource();

        $data = json_decode($request->getContent(), true);
        $resource->setName($data['name']);

        $em = $this->getDoctrine()->getManager();
        $em->persist($resource);
        $em->flush();

        return new JsonResponse($resource->toArray());
    }

    /**
     * Finds and displays a Resource entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('MayflowerTPPBundle:Resource')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Resource entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('MayflowerTPPBundle:Resource:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Resource entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('MayflowerTPPBundle:Resource')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Resource entity.');
        }

        $editForm = $this->createForm(new ResourceType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('MayflowerTPPBundle:Resource:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Resource entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('MayflowerTPPBundle:Resource')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Resource entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new ResourceType(), $entity);
        $editForm->submit($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('resource_edit', array('id' => $id)));
        }

        return $this->render('MayflowerTPPBundle:Resource:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Resource entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->submit($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('MayflowerTPPBundle:Resource')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Resource entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('resource'));
    }

    /**
     * Creates a form to delete a Resource entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
