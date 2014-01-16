<?php

namespace Mayflower\TPPBundle\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Mayflower\TPPBundle\Entity\Resource;
use Mayflower\TPPBundle\Form\ResourceType;
use Symfony\Component\HttpFoundation\Response;

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

        $resource_arr = array_map(function (Resource $resource) {
            return $resource->toArray();
        }, $resources);

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
     * Deletes a Resource entity.
     *
     */
    public function deleteAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $entity = $em->getRepository('MayflowerTPPBundle:Resource')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Resource entity.');
        }

        $em->remove($entity);
        $em->flush();

        $response = new Response('', 204);
        return $response;
    }

}
